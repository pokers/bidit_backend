
import { log } from '../lib'
import { Service } from "typedi";
import { UserService } from './userService';
import { ItemService } from './itemService';
import { AuthService } from './authService';

@Service()
export class Services {
    constructor(
        private userService:UserService,
        private itemService:ItemService,
        private authService:AuthService
    ){
    }

    getService(){
        try{
            return {
                userService: this.userService,
                itemService: this.itemService,
                authService: this.authService
            }
        }catch(e){
            log.error('exception > getService : ', e);
            throw e;
        }
    }
}
