import { log } from '../lib'
import { User, Penalty, } from '../types'
import { ModelName } from './model'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'
import { Op } from 'sequelize'
import { PenaltyAttributes } from './model/penalty'

@Service()
@sealed
class PenaltyRepository extends RepositoryBase{

    async getUserPenalty(penaltyQuery:PenaltyAttributes, include?:string[]): Promise<Penalty>{
        try{
            const PenaltyModel = this.models.getModel(ModelName.penalty);
            const result:Penalty = await PenaltyModel.findOne({
                where: {...penaltyQuery},
                include: include,
                raw:true,
                nest: true
            });
            return result;
        }catch(e){
            log.error('repo> getUserPenalty> exception : ', e);
            throw e;
        }
    }

}

export { PenaltyRepository }