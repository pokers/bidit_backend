import 'reflect-metadata';
import { log, ErrorInvalidToken, ErrorCouldNotAdd, ErrorNotFoundSocialUserInfo, ErrorUserNotFound, Crypto } from '../lib'
import { AppSyncResolverEvent, Context, AppSyncIdentityLambda } from 'aws-lambda'
import { User, ItemQueryInput, ItemConnection, Maybe, UserInfoResult } from '../types'
import { Provider } from './provider'
import { UserService, ItemService, AuthService } from '../services'
import { Container } from 'typedi'
import { Transaction } from 'sequelize/types';
import { SQS } from 'aws-sdk';
import { AlarmService } from '../services/alarmService';

const initialize = async()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.initialize();
    }catch(e){
        log.error('exception > initialize : ', e);
        throw e;
    }
}

const destroy = async ()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.destroy();
    }catch(e){
        log.error('exception > destroy : ', e);
        throw e;
    }
}

const alarmResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    let payload:any
    try{
        log.info("Invoked alarmResolver : ", JSON.stringify(event), JSON.stringify(context));
        const identity:AppSyncIdentityLambda = event.identity as AppSyncIdentityLambda;
        if(!identity || !identity.resolverContext){
            throw ErrorNotFoundSocialUserInfo();
        }
        
        await initialize();
        switch(event.info.fieldName){
            case 'addUserAlarm':
                payload = await Container.get(AlarmService).addUserAlarm(event.arguments);
                break;
            default:
                break;
        }
        log.info('payload : ', payload);
        await destroy();
        return payload;
    }catch(e){
        await destroy();
        log.error('Exception > resolver :', e);
        throw e;
    }
}
export { alarmResolver }