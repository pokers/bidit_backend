import 'reflect-metadata';
import { log, cError, ErrorNotFoundSocialUserInfo } from '../lib'
import { AppSyncResolverEvent, Callback, Context, AppSyncIdentityLambda } from 'aws-lambda'
import { ItemService } from '../services';
import { Provider } from './provider'
import { Container } from 'typedi'
import { BiddingService } from '../services/biddingService';

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

const biddingResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    try{
        let payload:any
        log.info("Invoked biddingResolver : ", JSON.stringify(event), JSON.stringify(context));
    
        const identity:AppSyncIdentityLambda = event.identity as AppSyncIdentityLambda;
        if(!identity || !identity.resolverContext){
            throw ErrorNotFoundSocialUserInfo();
        }
        await initialize();
        switch(event.info.fieldName){
            case 'getMyBidding':
                payload = await Container.get(BiddingService).getMyBidding(identity.resolverContext, event.arguments, event.info.selectionSetList);
                break;
            case 'getBidding':
                payload = await Container.get(BiddingService).getBidding(identity.resolverContext, event.arguments, event.info.selectionSetList);
                break;
            case 'bid':
                payload = await Container.get(BiddingService).bid(identity.resolverContext, event.arguments, event.info.selectionSetList);
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

export { biddingResolver }