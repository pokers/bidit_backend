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
    Dibs
} from '../types';
import { ItemRepository } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorInvalidBodyParameter, ErrorUserNotFound, ErrorLowPriceBidding, ErrorSameUserBidding, ErrorOwnItemBidding, ErrorEndBidingItem,ErrorItemNotFound, MessageCommand } from '../lib';
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
    private logInfo(...arg:any){
        log.info('DibsService > ', ...arg);
    }
    private extractUserId(authInfo:AuthResult):number{
        if(!authInfo.userId){
            throw ErrorUserNotFound();
        }
        return authInfo.userId;
    }
    private getDibsRepository():DibsRepository{
        if(!this.repositories.getRepository().dibsRepo){
            throw ErrorModuleNotFound();
        }
        return this.repositories.getRepository().dibsRepo
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

}

export { DibsService }