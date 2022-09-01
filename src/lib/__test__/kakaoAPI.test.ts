import { KakaoAPI } from "../kakaoAPI";

describe('KakaoAPI Unit Test', ()=>{
    xtest('getTokenInfo', async ()=>{
        try{
            const inst = new KakaoAPI();
            const result = await inst.getTokenInfo('');
            console.log(result);
        }catch(e){
            console.log(e);
        }
    })

    xtest('getUserInfo', async ()=>{
        try{
            const inst = new KakaoAPI();
            const result = await inst.getUserInfo('');
            console.log(result);
        }catch(e){
            console.log(e);
        }
    })
})