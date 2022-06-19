import { log, ErrorDuplicatedItem } from '../lib'
import { Models, UniqueConstraintError } from './model'
import { Service } from 'typedi'
@Service()
export class RepositoryBase {
    constructor(protected models: Models){
    }

    protected isUniqueConstraintError(error:any){
        if(error instanceof UniqueConstraintError){
            const dupError:any = error.original;
            if(dupError.code && dupError.code === 'ER_DUP_ENTRY'){
                log.error('UniqueConstraintError : ', error);
                throw ErrorDuplicatedItem();
            }
        }

        throw error;
    }
}