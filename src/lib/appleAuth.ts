import { verifyIdToken, AppleIdTokenType } from 'apple-signin-auth'
import { Service } from "typedi";

@Service()
class AppleAuth {
    constructor(){

    }

    async verifyIdToken(token:string){
        try{
            const userInfo:AppleIdTokenType = await verifyIdToken(token,{
                nonce: 'NONCE',
                ignorExpiration: false
            });
            return userInfo;
        }catch(e){
            throw e;
        }
    }
}

export { AppleAuth, AppleIdTokenType }