import 'reflect-metadata';
import { log } from '../lib/logger'
import { AppSyncResolverEvent, Context } from 'aws-lambda'
import { User, ItemQueryInput, ItemConnection } from '../types'
import { Provider } from './provider'
import { UserService, ItemService } from '../services'
import { Container } from 'typedi'

const getUser = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    try{
        const getUser = async ():Promise<User>=>{
            return await Container.get(UserService).getUser(event.arguments, event.info.selectionSetList);
        }
        const getItem = async ():Promise<ItemConnection>=>{
            if(event.info.selectionSetList?.indexOf('items') >= 0){
                const itemQuery:ItemQueryInput = {userId: event.arguments.id};
                event.arguments = { ...event.arguments, ...itemQuery };
                return Container.get(ItemService).getItemList(event.arguments, event.info.selectionSetList);
            }
            return {};
        }
        const [user, items]= await Promise.all([getUser(), getItem()]);
        if(user){
            user.items = items;
        }
        log.info('result : ', user);
        return user;
    }catch(e){
        log.error('exception > getUser : ', e);
        throw e;
    }
}

const initialize = async()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.initialize();
    }catch(e){
        log.error('exception > getUser : ', e);
        throw e;
    }
}

const userResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    let payload:any
    try{
        log.info("Invoked userResolver : ", JSON.stringify(event), JSON.stringify(context));
    
        await initialize();
        switch(event.info.fieldName){
            case 'getUser':
                payload = await getUser(event);
                log.info('payload : ', payload)
                break;
            default:
                break;
        }
    }catch(e){
        log.error('Exception > resolver :', e)
    }finally{
        return payload;
    }
}
export { userResolver }