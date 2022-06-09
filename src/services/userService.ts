import { User } from '../types';
import { Repositories } from '../repository';
import { log, ErrorModuleNotFound } from '../lib';
import { Service } from 'typedi';

declare interface iUserService {
    getUser(arg: any, selectionSetList:string[]): Promise<User>
}

@Service()
class UserService implements iUserService {
    constructor(private repositories:Repositories){
    }

    async getUser(arg: any, selectionSetList?:string[]): Promise<User>{
        try{
            const { id } = arg;
            if(!this.repositories.getRepository().userRepo){
                throw ErrorModuleNotFound();
            }
            const queryResult = await this.repositories.getRepository().userRepo.getUser(id);
            return queryResult
        }catch(e){
            log.error('exception > ', e);
            throw e;
        }
    }
}

export { UserService }