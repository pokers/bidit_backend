import { log } from '../lib'
import { Service } from "typedi";
import { ItemRepository } from "./itemRepository";
import { UserRepository } from "./userRepository";

@Service()
export class Repositories {
    constructor(
        private itemRepository:ItemRepository,
        private userRepository:UserRepository
    ){
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
