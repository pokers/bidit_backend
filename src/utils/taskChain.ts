import { Service } from 'typedi';
import { log } from '../lib';

type Task<T> = {
    excutor(org:T, value:any):T;
    value:any;
}

interface iTaskChain<T> {
    init():TaskChain<T>;
    add(task:Task<T>):TaskChain<T>;
    run():T;
}

@Service()
class TaskChain<T> implements iTaskChain<T>{
    private taskChain:Array<Task<T>> = [];

    public init():TaskChain<T>{
        try{
            this.taskChain = [];
            return this;
        }catch(e){
            log.error('exception> svc> init>', e);
            throw e;
        }
    }

    public add(task:Task<T>):TaskChain<T>{
        try{
            this.taskChain.push(task);
            return this;
        }catch(e){
            log.error('exception> svc> addTaskChain>', e);
            throw e;
        }
    }
    public run():T{
        try{
            return this.taskChain.reduce((acc:T, task:Task<T>)=>{
                return task.excutor(acc, task.value);
            }, {} as T);
        }catch(e){
            log.error('exception> svc> runTask>', e);
            throw e;
        }
    }
}


export { TaskChain, Task, iTaskChain }