import { 
    // Items
    Item, 
    ItemConnection, 
    ItemEdge,
    ItemImage, 
    ItemQueryInput,
    
    // Category
    Category, 
    CategoryConnection, 
    
    // Page
    PageInfo, 
    FirstLastItem, 
    CategoryEdge,

    AuthResult
} from '../types';
import { ItemRepository, QueryOptions } from '../repository';
import { log } from '../lib/logger';
import { ErrorModuleNotFound, ErrorNotSupportedParameters, ErrorInvalidBodyParameter, ErrorUserNotFound, MessageBody, MessageCommand } from '../lib';
import { ModelName, CursorName, Order, Transaction } from '../repository/model';
import { Service } from 'typedi'
import { ServiceBase } from './serviceBase'


@Service()
class SchedulerService extends ServiceBase{
    private isSellingItem(item:Item):boolean{
        return (item.status === 0 || item.status === 1);
    }

    async triggerSuccessfulBidItmes():Promise<Item[]>{
        try{
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const queryOptions:QueryOptions = {
                end : (new Date(this.getTimeNow().getTime() + (3 * 60 * 1000))).toISOString(),
                order: Order.ASC,
                limit: 100
            }
            const itemQuery:ItemQueryInput={
                status: 1   // 1=ongoing
            }
            const itemList:Item[] = await itemRepo.getItemsByDueDate(itemQuery, queryOptions);
            log.info('svc > triggerSuccessfulBidItmes > itemList : ', itemList);
            if(itemList && itemList.length > 0){
                await Promise.all(itemList.map(item=>{
                    if(item.dueDate){
                        const messageBody:MessageBody = {
                            command: MessageCommand.successfulBid,
                            item: item,
                            delaySeconds: (new Date(item.dueDate).getTime() - this.getTimeNow().getTime()) / 1000
                        }
                        return this.messageQueue.sendMessageToBidQueue(messageBody);
                    }
                }));
            }

            return itemList;
        }catch(e){
            log.error('exception > triggerSuccessfulBidItmes : ', e);
            throw e;
        }
    }

    async triggerEndingSoonItems(minutes:number):Promise<Item[]>{
        try{
            if(!this.repositories.getRepository().itemRepo){
                throw ErrorModuleNotFound();
            }
            const start = (new Date(this.getTimeNow().getTime() + (30 * 60 * 1000)));
            const itemRepo:ItemRepository = this.repositories.getRepository().itemRepo;
            const queryOptions:QueryOptions = {
                start: start.toISOString(),
                end : (new Date(start.getTime() + (10 * 60 * 1000))).toISOString(),
                order: Order.ASC,
                limit: 500
            }
            const itemQuery:ItemQueryInput={
            }
            const itemList:Item[] = await itemRepo.getItemsByDueDate(itemQuery, queryOptions);
            log.info('svc > triggerEndingSoonItems > itemList : ', itemList);
            if(itemList && itemList.length > 0){
                await Promise.all(itemList.map(item=>{
                    if(item.dueDate && this.isSellingItem(item)){
                        const messageBody:MessageBody = {
                            command: MessageCommand.notifyEndingSoon,
                            item: item,
                            delaySeconds: (new Date(item.dueDate).getTime() - start.getTime()) / 1000
                        }
                        return this.messageQueue.sendMessageToBidQueue(messageBody);
                    }
                }));
            }

            return itemList;
        }catch(e){
            log.error('svc> exception > triggerEndingSoonItems : ', e);
            throw e;
        }
    }
}

export { SchedulerService }