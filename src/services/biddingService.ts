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
    Bidding
} from '../types';
import { ItemRepository } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorInvalidBodyParameter, ErrorUserNotFound, ErrorLowPriceBidding, ErrorSameUserBidding, ErrorOwnItemBidding } from '../lib';
import { ModelName, CursorName, Order, Transaction, ItemAttributes } from '../repository/model';
import { Service } from 'typedi'
import { ServiceBase } from './serviceBase'
import { BiddingRepository } from '../repository/biddingRespository';

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
            }
            return;
        }catch(e){
            log.error('exception > svc > checkMaxBidItem : ', e);
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
            log.info('repo > getMyBidding > result : ', result);
            return result;
        }catch(e){
            log.error('exception > repo > getMyBidding:  ', e);
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


            const [maxBid, item ] = await Promise.all([
                biddingRepo.getMaxPriceBid(bid.itemId),
                itemRepo.getItem(bid.itemId)
            ]);
            this.logInfo('addBid > maxBid : ', maxBid);
            this.logInfo('addBid > item : ', item)

            this.checkMaxBidItem(maxBid, item, userId, bid.price);

            const newBidding:Bidding = await biddingRepo.addBid(userId, bid, transaction);
            this.logInfo('addBid > newBidding : ', newBidding)

            const updatedItem:Item = await itemRepo.updateItem(bid.itemId, {cPrice: bid.price}, undefined, transaction);
            
            await this.commit(transaction);
            transaction = null;
            log.info('svc > addBid > Item result : ', updatedItem);
            
            return newBidding;
        }catch(e){
            if(transaction){
                await this.rollback(transaction);
            }
            log.error('exception > svc > addBid : ', e);
            throw e;
        }
    }
}

export { BiddingService }