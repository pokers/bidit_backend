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
import { ModelName, CursorName, Order, Transaction, UserAlarmAttributes } from '../repository/model';
import { Service } from 'typedi'
import { ServiceBase } from './serviceBase'


@Service()
class AlarmService extends ServiceBase{
    private isSellingItem(item:Item):boolean{
        return (item.status === 0 || item.status === 1);
    }

    async addUserAlarm(arg: any, selectionSetList?:string[]):Promise<Boolean>{
        try{
            const { userId, status } = arg;
            const userAlarmRepo = this.repositories.getRepository().alarmRepo;
            const userAlarmQuery:UserAlarmAttributes = {
                userId: userId,
                status: status,
                alarmId: 1, // TODO : currently, there is only one alarm type as MASTER, it should be update when other alarm types are added.
            }
            await userAlarmRepo.addUserAlarm(userAlarmQuery);
            return true;
        }catch(e){
            log.error('exception > addUserAlarm : ', e);
            throw e;
        }
    }
}

export { AlarmService }