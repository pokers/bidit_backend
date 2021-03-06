import { log } from '../lib'
import { Service } from "typedi";
import { ItemRepository } from "./itemRepository";
import { UserRepository } from "./userRepository";
import { Models, Transaction } from './model';
import { sealed } from '../lib/decorators';
import { BiddingRepository } from './biddingRespository';
import { PenaltyRepository } from './penaltyRepository';
import { AlarmRepository } from './alarmRepository';

type RepoObjects = {
    [key: string]: any;
    itemRepo: ItemRepository
    userRepo: UserRepository
    biddingRepo: BiddingRepository
    penaltyRepo: PenaltyRepository
    alarmRepo: AlarmRepository
}
@Service()
@sealed
export class Repositories {
    constructor(
        private itemRepository:ItemRepository,
        private userRepository:UserRepository,
        private biddingRepository:BiddingRepository,
        private penaltyRepository:PenaltyRepository,
        private alarmRepository:AlarmRepository,
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

    getRepository():RepoObjects{
        try{
            return {
                itemRepo: this.itemRepository,
                userRepo: this.userRepository,
                biddingRepo: this.biddingRepository,
                penaltyRepo: this.penaltyRepository,
                alarmRepo: this.alarmRepository
            }
        }catch(e){
            log.error('exception > getRepository : ', e);
            throw e;
        }
    }
}

export { Models, Transaction, RepoObjects }