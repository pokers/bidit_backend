import { Service } from 'typedi';
import { log } from '../lib';

interface Task<T>{
    functor(acc:T, ...args:any[]):T;
    args:any[];
}

interface iFunctorList<T> {
    init():FunctorList<T>;
    add(task:Task<T>):FunctorList<T>;
    run():T;
}

@Service()
class FunctorList<T> implements iFunctorList<T>{
    private functorList:Array<Task<T>> = [];

    public init():FunctorList<T>{
        try{
            this.functorList = [];
            return this;
        }catch(e){
            log.error('exception> svc> init>', e);
            throw e;
        }
    }

    public add(task:Task<T>):FunctorList<T>{
        try{
            this.functorList.push(task);
            return this;
        }catch(e){
            log.error('exception> svc> add Functor>', e);
            throw e;
        }
    }
    public run():T{
        try{
            return this.functorList.reduce((acc:T, task:Task<T>)=>{
                return task.functor(acc, ...task.args);
            }, {} as T);
        }catch(e){
            log.error('exception> svc> run functor>', e);
            throw e;
        }
    }
}


export { FunctorList, Task, iFunctorList }