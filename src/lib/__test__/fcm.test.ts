import { Fcm, FcmMessage } from "../fcm";

describe('fcm Unit Test', ()=>{
    xtest('send fcm', async ()=>{
        try{
            const inst = new Fcm();
            const message:FcmMessage = {
                token: '',
                title: 'AOS 테스트 푸시',
                body: '테스트용 푸시입니다.!'
            }
            await inst.sendPushMessage(message);
        }catch(e){
            console.log(e);
        }
    })
})