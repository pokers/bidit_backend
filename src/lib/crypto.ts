import * as crypto from 'crypto'
import { Service } from 'typedi';

@Service()
class Crypto {
    getHash(plainText:string):string{
        return crypto.createHash('sha256').update(plainText).digest('hex');
    }
}

export { Crypto }