import { 
    // Items
    Item, 
    ItemConnection, 
    ItemEdge,
    ItemImage, 
    
    // Category
    Category, 
    CategoryConnection, 
    
    // Page
    PageInfo, 
    FirstLastItem, 
    CategoryEdge,

    AuthResult,
    Bidding,
    SuccessfulBid
} from '../types';
import { ItemRepository } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorInvalidBodyParameter, ErrorUserNotFound, ErrorLowPriceBidding, ErrorSameUserBidding, ErrorOwnItemBidding, ErrorEndBidingItem,ErrorItemNotFound, MessageCommand } from '../lib';
import { ModelName, CursorName, Order, Transaction, ItemAttributes, SuccessfulBidModel, SuccessfulBidAttributes } from '../repository/model';
import { Service } from 'typedi'
import { ServiceBase } from './serviceBase'
import { BiddingRepository } from '../repository/biddingRespository';
import { MessageBody } from '../lib'

enum DefaultDate {
    PAST='2022-01-01 00:00:00',
    FUTURE='2999-01-01 00:00:00'
}


@Service()
class BiddingService extends ServiceBase{
    
    // Private Methods
    private logInfo(...arg:any){
        log.info('biddingService > ', ...arg);
    }

    private checkMaxBidItem(maxBidItem:Bidding|null, item:Item|null, userId:number, price:number){
        try{
            if(maxBidItem){
                if(maxBidItem.price >= price){
                    throw ErrorLowPriceBidding();
                }
                if(maxBidItem.userId === userId){
                    throw ErrorSameUserBidding();
                }
            }
            if(item){
                if(item.userId === userId){
                    throw ErrorOwnItemBidding();
                }
                if(item.status === 2){
                    throw ErrorEndBidingItem();
                }
            }
            return;
        }catch(e){
            log.error('exception > svc > checkMaxBidItem : ', e);
            throw e;
        }
    }

    private checkSuccessfulBidItem(maxBidItem:Bidding|null, item:Item|null){
        try{
            if(!maxBidItem){
                throw ErrorItemNotFound();
            }
            if(!item){
                throw ErrorItemNotFound();
            }
            if(item.status !== 1){
                throw ErrorEndBidingItem();
            }
            return;
        }catch(e){
            log.error('exception > svc > checkSuccessfulBidItem : ', e);
            throw e;
        }
    }

    private checkFailureItem(item:Item|null){
        try{
            if(!item){
                throw ErrorItemNotFound();
            }
            if(item.status !== 0){
                throw ErrorEndBidingItem();
            }
            return;
        }catch(e){
            log.error('exception > svc > checkSuccessfulBidItem : ', e);
            throw e;
        }
    }

    private sendMessageToBidQueue(command:MessageCommand, body:any, delaySeconds?:number){
        try{
            const messageBody:MessageBody = {
                command: command,
                item: body,
                delaySeconds: delaySeconds || 0
            }
            return this.messageQueue.sendMessageToBidQueue(messageBody);
        }catch(e){
            log.error('exception > svc > checkSuccessfulBidItem : ', e);
            throw e;
        }
    }


    // Public Methods
    async getMyBidding(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Bidding[]>{
        try{
            const { biddingQuery } = arg;
            if(!authInfo.userId){
                throw ErrorUserNotFound();
            }

            if(!this.repositories.getRepository().biddingRepo){
                throw ErrorModuleNotFound();
            }
            const biddingRepo:BiddingRepository = this.repositories.getRepository().biddingRepo;
            const result:Bidding[] = await biddingRepo.getMyBidding(authInfo.userId, biddingQuery);
            log.info('service > getMyBidding > result : ', result);
            return result;
        }catch(e){
            log.error('exception > service > getMyBidding:  ', e);
            throw e;
        }
    }

    async getBidding(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Bidding[]>{
        try{
            const { biddingQuery } = arg;
            if(!authInfo.userId){
                throw ErrorUserNotFound();
            }

            if(!this.repositories.getRepository().biddingRepo){
                throw ErrorModuleNotFound();
            }
            const biddingRepo:BiddingRepository = this.repositories.getRepository().biddingRepo;
            const result:Bidding[] = await biddingRepo.getBidding(biddingQuery);
            log.info('repo > getBidding > result : ', result);
            return result;
        }catch(e){
            log.error('exception > repo > getBidding:  ', e);
            throw e;
        }
    }

    async bid(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Bidding>{
        let transaction:Transaction|null = null;
        try{
            const { bid } = arg;
            const userId = this.extractUserIdFromContext(authInfo);
            if(!userId){
                throw ErrorUserNotFound();
            }
            if(!bid){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().biddingRepo || !this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }

            transaction = await this.startTransaction();

            const biddingRepo:BiddingRepository = this.repositories.getRepository().biddingRepo;
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;


            const [ maxBid, item ] = await Promise.all([
                biddingRepo.getMaxPriceBid(bid.itemId),
                itemRepo.getItem(bid.itemId)
            ]);
            this.logInfo('addBid > maxBid : ', maxBid);
            this.logInfo('addBid > item : ', item)

            this.checkMaxBidItem(maxBid, item, userId, bid.price);

            const newBidding:Bidding = await biddingRepo.addBid(userId, bid, transaction);
            this.logInfo('addBid > newBidding : ', newBidding)

            const updatedItem:Item = await itemRepo.updateItem(bid.itemId, {status: 1, cPrice: bid.price}, undefined, undefined, transaction);
             
            await this.commit(transaction);
            transaction = null;
            log.info('svc > addBid > Item result : ', updatedItem);
            
            if(item.buyNow === bid.price){
                // BuyNow
                await this.successfulBid({item});
            }else{
                // TODO: consider code structuresend
                await this.sendMessageToBidQueue(MessageCommand.notifyHigherBidder, maxBid);
            }

            return newBidding;
        }catch(e){
            if(transaction){
                await this.rollback(transaction);
            }
            log.error('exception > svc > addBid : ', e);
            throw e;
        }
    }

    async successfulBid(arg: any): Promise<SuccessfulBid>{
        let transaction:Transaction|null = null;
        try{
            const { item } = arg;
            if(!item){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().biddingRepo || !this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }

            transaction = await this.startTransaction();

            const biddingRepo:BiddingRepository = this.repositories.getRepository().biddingRepo;
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;

            const foundItem:Item = await itemRepo.getItem(item.id, []);
            // const maxBid = await biddingRepo.getMaxPriceBid(item.id, item.dueDate);
            const dueDate = (new Date(item.dueDate)).toISOString();
            const highBids = await biddingRepo.getHighPriceBid(item.id, dueDate);
            const maxBid = highBids[0];
            

            this.logInfo('successfulBid > highBids : ', highBids);
            this.logInfo('successfulBid > maxBid : ', maxBid);
            this.logInfo('successfulBid > item : ', foundItem);
            this.checkSuccessfulBidItem(maxBid, foundItem);

            const bidInput:SuccessfulBidAttributes = {
                userId: maxBid.userId,
                itemId: maxBid.itemId,
                biddingId: maxBid.id
            };
            const successfulBid:SuccessfulBid = await biddingRepo.addSuccessfulBid(bidInput, transaction);
            const updatedItem:Item = await itemRepo.updateItem(item.id, {status: 2}, undefined, undefined, transaction);

            await this.commit(transaction);
            transaction = null;
            log.info('svc > successfulBid > Item result : ', updatedItem);

            // TODO: consider code structuresend
            const task = [];
            task.push(this.sendMessageToBidQueue(MessageCommand.notifySuccessfulBid, maxBid));
            highBids.slice(1).map((item)=>{
                task.push(this.sendMessageToBidQueue(MessageCommand.notifyFailedBid, item));
            });
            await Promise.all(task);
            
            return successfulBid;
        }catch(e){
            if(transaction){
                await this.rollback(transaction);
            }
            log.error('exception > svc > successfulBid : ', e);
            throw e;
        }
    }

    async failureItem(arg: any): Promise<Item>{
        let transaction:Transaction|null = null;
        try{
            const { item } = arg;
            if(!item){
                throw ErrorInvalidBodyParameter();
            }
            if(!this.repositories.getRepository().biddingRepo || !this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }

            transaction = await this.startTransaction();

            const biddingRepo:BiddingRepository = this.repositories.getRepository().biddingRepo;
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;

            const foundItem:Item = await itemRepo.getItem(item.id, []);
            
            this.logInfo('failureItem > item : ', foundItem);
            this.checkFailureItem(foundItem);

            const updatedItem:Item = await itemRepo.updateItem(item.id, {status: 3/*END*/}, undefined, undefined, transaction);

            await this.commit(transaction);
            transaction = null;
            log.info('svc > failureItem > Item result : ', updatedItem);
            
            // TODO: consider code structuresend
            this.sendMessageToBidQueue(MessageCommand.notifyFailureItem, foundItem);
            
            return foundItem;
        }catch(e){
            if(transaction){
                await this.rollback(transaction);
            }
            log.error('exception > svc > failureItem : ', e);
            throw e;
        }
    }
}

export { BiddingService }