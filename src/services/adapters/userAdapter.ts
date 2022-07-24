import { User, UserAlarm, Penalty } from '../../types';
import { log } from '../../lib';
import { Service } from 'typedi';
import { TaskChain, Task } from '../../utils'

@Service()
class UserAdapter {
    constructor(protected taskChain:TaskChain<User>){
        
    }

    public initBuilder():UserAdapter{
        try{
            this.taskChain.init();
            return this;
        }catch(e){
            log.error('exception> svc> initBuilder>', e);
            throw e;
        }
    }

    public addBuilder(task:Task<User>):UserAdapter{
        try{
            this.taskChain.add(task);
            return this;
        }catch(e){
            log.error('exception> svc> addBuilder>', e);
            throw e;
        }
    }
    public runBuilderChain():User{
        try{
            return this.taskChain.run();
        }catch(e){
            log.error('exception> svc> runBuilderChain>', e);
            throw e;
        }
    }

    public initUserObject(init:User, user:User):User{
        try{
            return user;
        }catch(e){
            log.error('exception> svc> UserAdapter>', e);
            throw e;
        }
    }
    public setPenalty(user:User, penalty:Penalty):User{
        try{
            user.penalty = penalty;
            return user;
        }catch(e){
            log.error('exception> svc> UserAdapter> ', e);
            throw e;
        }
    }
    public setUserAlarm(user:User, userAlarm:UserAlarm):User{
        try{
            user.userAlarm = userAlarm;
            return user;
        }catch(e){
            log.error('exception> svc> setUserAlarm> ', e);
            throw e;
        }
    }

    public setUserSellCount(user:User, count:number):User{
        try{
            if(user.counting){
                user.counting.sell = count;
            }else{
                user.counting = { sell: count };
            }
            return user;
        }catch(e){
            log.error('exception> svc> setUserAlarm> ', e);
            throw e;
        }
    }

    public setUserBuyCount(user:User, count:number):User{
        try{
            if(user.counting){
                user.counting.buy = count;
            }else{
                user.counting = { buy: count };
            }
            return user;
        }catch(e){
            log.error('exception> svc> setUserAlarm>', e);
            throw e;
        }
    }

    public buildUser(user:User){
        return (penalty:Penalty)=>{
            user.penalty = penalty;
            return (userAlarm:UserAlarm)=>{
                user.userAlarm = userAlarm;
                return (sellCount:number)=>{
                    user.counting = {
                        buy:0,
                        sell: sellCount
                    }
                    return (buyCount:number)=>{
                        user.counting!.buy = buyCount;
                        return user;
                    }
                };
            }
        }
    }
}

export { UserAdapter }