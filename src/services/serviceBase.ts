import { Service } from 'typedi';
import { KakaoAPI } from '../lib'
import { Repositories, Transaction } from '../repository'

@Service()
export class ServiceBase {
    constructor(protected repositories:Repositories, 
        protected kakaoAPI:KakaoAPI){

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
}