import { log } from '../lib/logger'
import { User } from '../types'
import { ModelName } from './model'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
@Service()
class UserRepository extends RepositoryBase{

    async getUser(userId:number): Promise<User>{
        try{
            const userModel = this.models.getModel(ModelName.user);
            const result:User = await userModel.findOne({
                where: {id: userId},
                raw:true
            })
            return result;
        }catch(e){
            log.error('exception> getUser : ', e);
            throw e;
        }
    }
}

export { UserRepository }