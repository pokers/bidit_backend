import { AppleAuth } from "../appleAuth";

describe('appleAuth Unit Test', ()=>{
    xtest('auth token', async ()=>{
        try{
            const inst = new AppleAuth();
            const result = await inst.verifyIdToken('');
            console.log('result : ', result);
        }catch(e){
            console.log(e);
        }
    })
})
