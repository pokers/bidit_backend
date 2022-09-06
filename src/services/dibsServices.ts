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
    SuccessfulBid,
    
    // Dibs
    Dibs,
    Maybe
} from '../types';
import { ItemRepository } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorCouldNotAdd, ErrorUserNotFound, ErrorLowPriceBidding, ErrorSameUserBidding, ErrorOwnItemBidding, ErrorEndBidingItem,ErrorItemNotFound, MessageCommand } from '../lib';
import { ModelName, CursorName, Order, Transaction, ItemAttributes, SuccessfulBidModel, SuccessfulBidAttributes } from '../repository/model';
import { Service } from 'typedi'
import { ServiceBase } from './serviceBase'
import { BiddingRepository } from '../repository/biddingRespository';
import { MessageBody } from '../lib'
import { DibsRepository } from '../repository/dibsRepository';

enum DefaultDate {
    PAST='2022-01-01 00:00:00',
    FUTURE='2999-01-01 00:00:00'
}


@Service()
class DibsService extends ServiceBase{
    
    // Private Methods
    protected logInfo(...arg:any){
        log.info('DibsService > ', ...arg);
    }
    protected extractUserId(authInfo:AuthResult):number{
        if(!authInfo.userId){
            throw ErrorUserNotFound();
        }
        return authInfo.userId;
    }
    protected extractItemId(arg:any):number{
        if(!arg.itemId){
            throw ErrorItemNotFound();
        }
        return arg.itemId;
    }
    protected getDibsRepository():DibsRepository{
        if(!this.getRepositories().getRepository().dibsRepo){
            throw ErrorModuleNotFound();
        }
        return this.getRepositories().getRepository().dibsRepo
    }
    protected getItemRepository():ItemRepository{
        if(!this.getRepositories().getRepository().itemRepo){
            throw ErrorModuleNotFound();
        }
        return this.getRepositories().getRepository().itemRepo
    }
    protected isValidItem(item:Maybe<Item>):Boolean {
        if(!(!!item)){
            throw ErrorItemNotFound();
        }
        return true;
    }

    // Public Methods
    async getMyDibs(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Dibs[]>{
        try{
            const userId:number = this.extractUserId(authInfo);
            const dibsRepository:DibsRepository = this.getDibsRepository();
            const dibs:Dibs[] = await dibsRepository.getDibsByUserId(userId);

            log.info('service > getMyDibs > result : ', dibs);
            return dibs;
        }catch(e){
            log.error('exception > service > getMyDibs:  ', e);
            throw e;
        }
    }

    async getDibsCount(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<number>{
        try{
            const itemId:number = this.extractItemId(arg);
            const dibsRepository:DibsRepository = this.getDibsRepository();
            const dibsCount:number = await dibsRepository.getDibsCountByItemId(itemId);

            log.info('service > getDibsCount > result : ', dibsCount);
            return dibsCount;
        }catch(e){
            log.error('exception > service > getDibsCount:  ', e);
            throw e;
        }
    }

    async addDibs(authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Dibs>{
        let transaction:Transaction|null = null;
        try{
            const userId:number = this.extractUserId(authInfo);
            const itemId:number = this.extractItemId(arg);
            
            const dibsRepository:DibsRepository = this.getDibsRepository();
            const itemRepository:ItemRepository = this.getItemRepository();
            
            const item:Item = await itemRepository.getItem(itemId);
            this.isValidItem(item);

            transaction = await this.startTransaction();
            const dibs:Maybe<Dibs> = await dibsRepository.addDibs(userId, itemId, transaction);
            if(dibs === null){
                throw ErrorCouldNotAdd();
            }

            await this.commit(transaction);
            transaction = null;

            log.info('service > addDibs > result : ', dibs);
            return dibs;
        }catch(e){
            if(transaction){
                await this.rollback(transaction);
            }
            log.error('exception > service > addDibs:  ', e);
            throw e;
        }
    }

}

export { DibsService }