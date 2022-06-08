import { ItemConnection, User, Repos } from '../types';
import { UserRepository } from '../repository';
import { log, cError, ErrorModuleNotFound } from '../lib';

declare interface iUserService {
    getUser(arg: any, selectionSetList:string[]): Promise<User>
}

class UserService implements iUserService {
    private repositories:Repos;
    
    constructor(repositories:Repos){
        this.repositories = repositories;
    }

    async getUser(arg: any, selectionSetList?:string[]): Promise<User>{
        try{
            const { id } = arg;
            if(!this.repositories.userRepo){
                throw ErrorModuleNotFound();
            }
            const queryResult = await this.repositories.userRepo.getUser(id);
            return queryResult
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }
}

export { UserService }