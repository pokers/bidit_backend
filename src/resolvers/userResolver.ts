import 'reflect-metadata';
import { log, ErrorInvalidToken, ErrorCouldNotAdd } from '../lib'
import { AppSyncResolverEvent, Context } from 'aws-lambda'
import { User, ItemQueryInput, ItemConnection, Maybe, UserInfoResult } from '../types'
import { Provider } from './provider'
import { UserService, ItemService, AuthService } from '../services'
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

const addUser = async(event:AppSyncResolverEvent<any, any>):Promise<User>=>{
    try{
        const getSocialUserInfo = async ():Promise<UserInfoResult>=>{
            if(event.request.headers.authorization){
                return await Container.get(AuthService).getSocialUserInfo(event.request.headers.authorization);
            }
            throw ErrorInvalidToken();
        }
        
        // do
        const [socialUserInfo]= await Promise.all([getSocialUserInfo()]);
        log.info('socialUserInfo : ', socialUserInfo);

        const addUser = async (socialUserInfo:UserInfoResult):Promise<Maybe<User>>=>{
            return await Container.get(UserService).addUser(socialUserInfo);
        }
        
        const [user]= await Promise.all([addUser(socialUserInfo)]);
        log.info('addUser result : ', user);
                
        if(!user){
            throw ErrorCouldNotAdd();
        }
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
                break;
            case 'addUser':
                payload = await addUser(event);
                break;
            default:
                break;
        }
        log.info('payload : ', payload)
        return payload;
    }catch(e){
        log.error('Exception > resolver :', e);
        throw e;
    }
}
export { userResolver }