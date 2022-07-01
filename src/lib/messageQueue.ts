import { log } from './logger';
import { sqsEnv } from '../config'
import { SQS} from 'aws-sdk';
import { SQSRecord } from 'aws-lambda';
import { Service } from 'typedi'

enum MessageCommand {
    successfulBid,
    notifyHigherBidder,
}
type MessageBody = {
    command: MessageCommand,
    item?: any,
    delaySeconds?:number
}

@Service()
class MessageQueue {
    validDelaySeconds = (seconds?:number)=>{
        let result = seconds || 0;
        if(result < 0) return 0;
        if(result > 900) return 900;
        return result;
    }

    async sendMessageToBidQueue(messageBody:MessageBody){
        try{
            const sqsInst = new SQS({apiVersion: '2012-11-05'});
            const sendParams:SQS.Types.SendMessageRequest = {
                QueueUrl: sqsEnv.bidQueue,
                MessageBody: JSON.stringify(messageBody),
                DelaySeconds: this.validDelaySeconds(messageBody.delaySeconds)
            }
            const sendResult = await sqsInst.sendMessage(sendParams).promise();
            log.info('MessageQueue > sendMessageToBidQueue > sendResult : ', sendResult);
        }catch(e){
            log.error('MessageQueue > exception : sendMessageToBidQueue ', e);
            throw e;
        }
    }

    async delMessageToBidQueue(record:SQSRecord){
        try{
            const sqsInst = new SQS({apiVersion: '2012-11-05'});
            const delParams:SQS.Types.DeleteMessageRequest = {
                QueueUrl: sqsEnv.bidQueue,
                ReceiptHandle: record.receiptHandle
            }
            await sqsInst.deleteMessage(delParams).promise();
        }catch(e){
            log.error('MessageQueue > exception : sendMessageToBidQueue ', e);
            throw e;
        }
    }
}

export { MessageQueue, MessageBody, MessageCommand };


