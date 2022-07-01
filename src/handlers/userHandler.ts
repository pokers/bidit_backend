import 'reflect-metadata';
import { log } from '../lib'
import { SQSEvent } from 'aws-lambda';
import { ServiceQuotas, SQS } from 'aws-sdk';

const userHandler = async (event: SQSEvent)=>{
    try{
        log.info('invoked userHandler : ', JSON.stringify(event));

        if(event.Records && event.Records.length > 0){
            const record = event.Records[0];

            const sqsInst = new SQS({apiVersion: '2012-11-05'});
            const delParams:SQS.Types.DeleteMessageRequest = {
                QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/164739657386/testQueue.fifo',
                ReceiptHandle: record.receiptHandle
            }
            sqsInst.deleteMessage(delParams).promise();
            
            log.info('Process add User ...');
            
            const sendParams:SQS.Types.SendMessageRequest = {
                QueueUrl: 'https://sqs.ap-northeast-2.amazonaws.com/164739657386/addUserQueue.fifo',
                MessageBody: JSON.stringify(record.attributes),
                DelaySeconds: 0,
                MessageDeduplicationId: record.attributes.MessageDeduplicationId,
                MessageGroupId: record.attributes.MessageGroupId
            }

            const sendResult = await sqsInst.sendMessage(sendParams).promise();
            log.info('sendMesage : ', sendResult);
        }
    }catch(e){
        log.error('Exception > resolver :', e);
        throw e;
    }
}
export { userHandler }