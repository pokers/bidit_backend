import { log } from './logger'
import { ErrorIsNotInitialized } from './error'
import { fcmEnv } from '../config'
import { initializeApp, ServiceAccount, App} from 'firebase-admin/app'
import { credential, messaging } from 'firebase-admin'
import { Service } from 'typedi'
import firebaseCredential from '../config/bidit-firebase.json';

type FcmMessage = {
    token: string,
    title: string,
    body: string,
    style?: string
}

@Service()
class Fcm {
    private fcmInst:App;
    private isInitialized:boolean = false;
    constructor(){
        try{
            this.fcmInst = initializeApp({
                credential: credential.cert(firebaseCredential as ServiceAccount)
            });
            this.isInitialized = true;
        }catch(e){
            log.error('lib> Fcm> exception : ', e);
            throw e;
        }
    }

    async sendPushMessage(fcmMessage:FcmMessage){
        try{
            if(!this.isInitialized){
                throw ErrorIsNotInitialized();
            }
            const message = {
                token: fcmMessage.token,
                data:{
                    title: fcmMessage.title,
                    body: fcmMessage.body
                }
            }
            log.info('sendPush :', message);
            const result = await messaging().send(message);
        }catch(e){
            log.error('lib> Fcm> exception : ', e);
            throw e;
        }
    }

}

export { Fcm, FcmMessage }