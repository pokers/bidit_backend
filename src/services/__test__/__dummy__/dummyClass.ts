import { SequelizeORM, Transaction, UniqueConstraintError } from '../../../lib/SequelizeORM';
import { ItemRepository, RepoObjects } from '../../../repository';
import { Repositories, UserRepository, BiddingRepository, PenaltyRepository, AlarmRepository, DibsRepository, Models } from '../../../repository'
import { KakaoAPI, MessageQueue } from '../../../lib'

export class DummyItemRepository extends ItemRepository {}
export class DummyUserRepository extends UserRepository {}
export class DummyBiddingRepository extends BiddingRepository {}
export class DummyPenaltyRepository extends PenaltyRepository {}
export class DummyAlarmRepository extends AlarmRepository {}
export class DummyDibsRepository extends DibsRepository {}
export class DummyModels extends Models {}

export class DummyRepositories extends Repositories {

    async startTransaction():Promise<Transaction>{
        return {} as Transaction;``
    }
    async commit(transaction:Transaction){
    }
    async rollback(transaction:Transaction){
    }
}

export class DummyKakaoAPI extends KakaoAPI {

}

export class DummyMessageQueue extends MessageQueue {

}

export const dummySequelizeORM = new SequelizeORM('dummyRegion')
export const dummyModels = new DummyModels(dummySequelizeORM);
export const dummyItemRepo = new DummyItemRepository(dummyModels);
export const dummyUserRepo = new DummyUserRepository(dummyModels);
export const dummyBiddingRepo = new DummyBiddingRepository(dummyModels);
export const dummyPenaltyRepo = new DummyPenaltyRepository(dummyModels);
export const dummyAlarmRepo = new DummyAlarmRepository(dummyModels);
export const dummyDibsRepo = new DummyDibsRepository(dummyModels);


export const dummyRepo = new DummyRepositories(dummyItemRepo, 
                                                    dummyUserRepo, 
                                                    dummyBiddingRepo, 
                                                    dummyPenaltyRepo, 
                                                    dummyAlarmRepo, 
                                                    dummyDibsRepo, 
                                                    dummyModels);
export const dummykakaoAPI = new KakaoAPI();
export const dummyMessageQueue = new MessageQueue();