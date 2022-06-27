import 'reflect-metadata';
import { log } from '../lib'
import { EventBridgeEvent } from 'aws-lambda';
import { Container } from 'typedi';
import { SchedulerService } from '../services/schedulerService';
import { Provider } from '../resolvers/provider'

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


const bidScheduleHandler = async (event:any)=>{
    try{
        log.info('invked bidScheduleHandler : ', JSON.stringify(event));

        await initialize();
        switch(event.command){
            case 'retrieveEndingSoonItem':
                const payload = await Container.get(SchedulerService).triggerEndingSoonItems();
                break;
        }

        await destroy();
    }catch(e){
        await destroy();
        log.error('Exception > resolver :', e);
        throw e;
    }
}
export { bidScheduleHandler }