import { ItemConnection, User } from '../types';
import { UserRepository } from '../repository';
import { log } from '../lib/logger';

declare interface iUserService {
    getUser(arg: any, selectionSetList:string[]): Promise<User>
}

class UserService implements iUserService {
    // TODO : any type shoud be changed to Generic Type
    private repoProvider:(name?:string)=>any;
    
    constructor(repoProvoder: (name?:string)=>any){
        this.repoProvider = repoProvoder;
    }

    async getUser(arg: any, selectionSetList?:string[]): Promise<User>{
        try{
            const { id } = arg;
            const userRepo:UserRepository = this.repoProvider().userRepo;
            const queryResult = await userRepo.getUser(id);
            return queryResult;
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }
}

export { UserService }