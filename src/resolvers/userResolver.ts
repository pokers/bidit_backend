import { log } from '../lib/logger'
import { AppSyncResolverEvent, Context } from 'aws-lambda'
import { User, ItemQueryInput, ItemConnection, UserResolverService } from '../types'
import { Provider } from './provider'

// TODO : it should be placed in class such as UserResolver class.
const getUser = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    try{
        const provider:Provider = await Provider.getInstance();
        const services:UserResolverService = provider.getUserResolverService();

        const getUser = async ():Promise<User>=>{
            return await services.userService.getUser(event.arguments, event.info.selectionSetList);
        }
        const getItem = async ():Promise<ItemConnection>=>{
            if(event.info.selectionSetList?.indexOf('items') >= 0){
                const itemQuery:ItemQueryInput = {userId: event.arguments.id};
                event.arguments = { ...event.arguments, ...itemQuery };
                return services.itemService.getItemList(event.arguments, event.info.selectionSetList);
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


const userResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    let payload:any
    try{
        log.info("Invoked userResolver : ", JSON.stringify(event), JSON.stringify(context));
    
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
        await Provider.destroy();
        return payload;
    }
}

export { userResolver }