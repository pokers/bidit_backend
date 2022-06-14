import { log } from '../lib'
import { Service } from "typedi";
import { ItemRepository } from "./itemRepository";
import { UserRepository } from "./userRepository";
import { Models, Transaction } from './model';

@Service()
export class Repositories {
    constructor(
        private itemRepository:ItemRepository,
        private userRepository:UserRepository,
        private models:Models
    ){
    }

    async startTransaction():Promise<Transaction>{
        return await this.models.startTransaction();
    }
    async commit(transaction:Transaction){
        await this.models.commit(transaction);
    }
    async rollback(transaction:Transaction){
        await this.models.rollback(transaction);
    }

    getRepository(){
        try{
            return {
                itemRepo: this.itemRepository,
                userRepo: this.userRepository
            }
        }catch(e){
            log.error('exception > getRepository : ', e);
            throw e;
        }
    }
}

export { Models, Transaction }