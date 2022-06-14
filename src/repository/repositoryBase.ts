import { Models, Transaction } from './model'
import { Service } from 'typedi'
@Service()
export class RepositoryBase {
    constructor(protected models: Models){
    }
}