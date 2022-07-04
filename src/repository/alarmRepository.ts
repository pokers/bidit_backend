import { log } from '../lib'
import { Alarm, UserAlarm} from '../types'
import { ModelName, AlarmAttributes } from './model'
import { RepositoryBase } from './repositoryBase'
import { Service } from 'typedi'
import { sealed } from '../lib/decorators'
import { Op } from 'sequelize'

@Service()
@sealed
class AlarmRepository extends RepositoryBase{

    async getUserAlarm(alarmQuery:AlarmAttributes, include?:string[]): Promise<UserAlarm>{
        try{
            const userAlarmModel = this.models.getModel(ModelName.userAlarm);
            const result:UserAlarm = await userAlarmModel.findOne({
                where: {...alarmQuery},
                include: include,
                raw:true,
                nest: true
            });
            return result;
        }catch(e){
            log.error('repo> getUserAlarm> exception : ', e);
            throw e;
        }
    }

}

export { AlarmRepository }