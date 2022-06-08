import { log } from '../lib/logger'
import { AppSyncResolverEvent, Context } from 'aws-lambda'
import { ItemService } from '../services';
import { ItemResolverService } from '../types'
import { Provider } from './provider'

const getItemService = async():Promise<ItemService>=>{
    try{
        const provider:Provider = await Provider.getInstance();
        const services:ItemResolverService = provider.getItemResolverService();
        return services.itemService;
    }catch(e){
        log.error('exception > getUser : ', e);
        throw e;
    }
}

const itemResolver = async (event:AppSyncResolverEvent<any, any>, context: Context)=>{
    let payload:any
    try{
        log.info("Invoked itemResolver : ", JSON.stringify(event), JSON.stringify(context));
    
        switch(event.info.fieldName){
            case 'getItem':
                payload = await (await getItemService()).getItem(event.arguments, event.info.selectionSetList);
                break;
            case 'getItemList':
                payload = await (await getItemService()).getItemList(event.arguments, event.info.selectionSetList);
                break;
            case 'getCategoryList':
                payload = await (await getItemService()).getCategoryList(event.arguments);
                break;
            case 'getCategory':
                payload = await (await getItemService()).getCategory(event.arguments);
                break;
            case 'scanCategory':
                payload = await (await getItemService()).scanCategory();
                break;
            default:
                break;
        }
    }catch(e){
        log.error('Exception > ', e)
    }finally{
        await Provider.destroy();
        return payload;
    }
}

export { itemResolver }