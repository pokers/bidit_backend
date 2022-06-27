import { Service } from 'typedi';
import { KakaoAPI } from '../lib'
import { MessageQueue } from '../lib/messageQueue';
import { Repositories, Transaction } from '../repository'

@Service()
export class ServiceBase {
    constructor(protected repositories:Repositories, 
        protected kakaoAPI:KakaoAPI,
        protected messageQueue:MessageQueue){

    }
    async startTransaction():Promise<Transaction>{
        return await this.repositories.startTransaction();
    }
    async commit(transaction:Transaction){
        await this.repositories.commit(transaction);
    }
    async rollback(transaction:Transaction){
        await this.repositories.rollback(transaction);
    }
    extractUserIdFromContext(authInfo:any):number|null{
        if(authInfo.userId){
            return parseInt(authInfo.userId);
        }
        return null;
    }
    getTimeNow(){
        let now = new Date();
        now.setTime(now.getTime() + (9*60*60*1000));
        return now;
    }
}