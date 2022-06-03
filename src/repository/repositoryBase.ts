import { log } from '../lib/logger'
import { AuroraMySql } from '../lib/auroraMySql'
import { User } from '../types'
import { Models } from './model'

export class RepositoryBase {
    protected models: Models
    constructor(models: Models){
        this.models = models;
    }
}