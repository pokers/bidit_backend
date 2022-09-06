import 'reflect-metadata';
import { log, cError, ErrorNotFoundSocialUserInfo } from '../lib'
import { AppSyncResolverEvent, Callback, Context, AppSyncIdentityLambda } from 'aws-lambda'
import { DibsService, ItemService } from '../services';
import { Provider } from './provider'
import { Container } from 'typedi'
import { BiddingService } from '../services/biddingService';

export const initialize = async()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.initialize();
    }catch(e){
        log.error('exception > initialize : ', e);
        throw e;
    }
}

export const destroy = async ()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.destroy();
    }catch(e){
        log.error('exception > destroy : ', e);
        throw e;
    }
}

export const extractIdentity = (event:AppSyncResolverEvent<any, any>):AppSyncIdentityLambda=>{
    const identity = event.identity as AppSyncIdentityLambda
    if(!identity || !identity.resolverContext){
        throw ErrorNotFoundSocialUserInfo();
    }
    return identity;
}
const dibsResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    try{
        let payload:any
        log.info("Invoked dibsResolver : ", JSON.stringify(event), JSON.stringify(context));

        const identity:AppSyncIdentityLambda = extractIdentity(event);
        await initialize();

        switch(event.info.fieldName){
            case 'getMyDibs':
                payload = await Container.get(DibsService).getMyDibs(identity.resolverContext, event.arguments, event.info.selectionSetList);
                break;
            case 'getDibsCount':
                payload = await Container.get(DibsService).getDibsCount(identity.resolverContext, event.arguments, event.info.selectionSetList);
                break;
            case 'addDibs':
                payload = await Container.get(DibsService).addDibs(identity.resolverContext, event.arguments, event.info.selectionSetList);
                break;
            default:
                break;
        }

        log.info('try to destroy sequelize');
        await destroy();
        return payload;
    }catch(e){
        await destroy();
        log.error('Exception > resolver :', e);
        throw e;
    }
}

export { dibsResolver }