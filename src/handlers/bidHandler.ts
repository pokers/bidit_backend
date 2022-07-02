import 'reflect-metadata';
import { log, MessageCommand } from '../lib'
import { EventBridgeEvent, SQSEvent,SQSRecord } from 'aws-lambda';
import { ServiceQuotas, SQS } from 'aws-sdk';
import { sqsEnv } from '../config'
import { Container } from 'typedi';
import { BiddingService } from '../services/biddingService';
import { Provider } from '../resolvers/provider'
import { PushService } from '../services';

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

const delRecord = async (record:SQSRecord)=>{
    try{
        const sqsInst = new SQS({apiVersion: '2012-11-05'});
        const delParams:SQS.Types.DeleteMessageRequest = {
            QueueUrl: sqsEnv.bidQueue,
            ReceiptHandle: record.receiptHandle
        }
        await sqsInst.deleteMessage(delParams).promise();
    }catch(e){
        log.error('Exception > delMessage :', e);
        throw e;
    }
}

const getRecord = (event:SQSEvent):SQSRecord|null=>{
    try{
        if(event.Records && event.Records.length > 0){
            return event.Records[0];
        }
        return null;
    }catch(e){
        log.error('Exception > getMessage :', e);
        throw e;
    }
}

const bidHandler = async (event:SQSEvent)=>{
    let message = null;
    try{
        log.info('invoked bidHandler : ', JSON.stringify(event));
        message = getRecord(event);
        await initialize();
        if(message){
            const body = JSON.parse(message.body);

            switch(body.command){
                case MessageCommand.successfulBid:
                    const payload = await Container.get(BiddingService).successfulBid(body);
                    break;
                case MessageCommand.notifyHigherBidder:
                    await Container.get(PushService).notifyHighBidder(body);
                    break;
                case MessageCommand.notifyEndingSoon:
                    await Container.get(PushService).notifyEndingSoon(body);
                    break;
                case MessageCommand.notifySuccessfulBid:
                    await Container.get(PushService).notifySuccessfulBid(body);
                    break;
                case MessageCommand.notifyFailedBid:
                    await Container.get(PushService).notifyFailedBid(body);
                    break;
            }
            await delRecord(message);
        }
        await destroy();
    }catch(e){
        if(message){
            await delRecord(message);
        }
        await destroy();
        log.error('Exception > bidHandler :', e);
        throw e;
    }
}
export { bidHandler }