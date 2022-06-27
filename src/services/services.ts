
import { log } from '../lib'
import { Service } from "typedi";
import { UserService } from './userService';
import { ItemService } from './itemService';
import { AuthService } from './authService';
import { BiddingService } from './biddingService';
import { SchedulerService } from './schedulerService';

@Service()
export class Services {
    constructor(
        private userService:UserService,
        private itemService:ItemService,
        private authService:AuthService,
        private biddingService:BiddingService,
        private schedulerService:SchedulerService
    ){
    }

    getService(){
        try{
            return {
                userService: this.userService,
                itemService: this.itemService,
                authService: this.authService,
                biddingService: this.biddingService,
                schedulerService: this.schedulerService
            }
        }catch(e){
            log.error('exception > getService : ', e);
            throw e;
        }
    }
}
