import 'reflect-metadata';
import { log, cError } from '../lib'
import { AppSyncResolverEvent, Callback, Context } from 'aws-lambda'
import { ItemService } from '../services';
import { Provider } from './provider'
import { Container } from 'typedi'

const initialize = async()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.initialize();
    }catch(e){
        log.error('exception > getUser : ', e);
        throw e;
    }
}

const itemResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    try{
        let payload:any
        log.info("Invoked itemResolver : ", JSON.stringify(event), JSON.stringify(context));
    
        await initialize();
        switch(event.info.fieldName){
            case 'getItem':
                payload = await Container.get(ItemService).getItem(event.arguments, event.info.selectionSetList);
                break;
            case 'getItemList':
                payload = await Container.get(ItemService).getItemList(event.arguments, event.info.selectionSetList);
                break;
            case 'getCategoryList':
                payload = await Container.get(ItemService).getCategoryList(event.arguments);
                break;
            case 'getCategory':
                payload = await Container.get(ItemService).getCategory(event.arguments);
                break;
            case 'scanCategory':
                payload = await Container.get(ItemService).scanCategory();
                break;
            default:
                break;
        }

        return payload;
    }catch(e){
        log.error('Exception > resolver :', e);
        throw e;
    }
}

export { itemResolver }