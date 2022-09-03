import { dummyRepo, dummykakaoAPI, dummyMessageQueue } from './dummyClass'
import { DibsService } from "../dibsServices";


describe('DibsService Test', ()=>{
    test('initialize inst', ()=>{
        const inst = new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue);
    })
})