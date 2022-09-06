import { 
    AuthResult,
    Dibs,
    Maybe,
    Item,
} from '../../types';
import { cError, ErrorModuleNotFound } from '../../lib';

import { dummyRepo, dummykakaoAPI, dummyMessageQueue, DummyDibsRepository, DummyRepositories, dummyModels } from './__dummy__/dummyClass'
import { DibsService } from "../dibsServices";
import { AlarmRepository, DibsRepository, ItemRepository, RepoObjects, UserRepository, BiddingRepository, PenaltyRepository, Repositories, Transaction } from '../../repository'

class dummyDibsServiceClass extends DibsService {
    // wrap private methods
    
    testExtractUserId(authInfo:AuthResult):number{
        return this.extractUserId(authInfo);
    }

    testExtractItemId(authInfo:AuthResult):number{
        return this.extractItemId(authInfo);
    }

    testGetDibsRepository():DibsRepository{
        return this.getDibsRepository();
    }

    testGetItemRepository():ItemRepository {
        return this.getItemRepository();
    }
}

describe('DibsService Test', ()=>{
    describe('DibsService Test - instance', ()=>{
        test('initialize inst', ()=>{
            const inst = new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue);
            expect(inst).toBeTruthy();
            expect(inst).toBeInstanceOf(DibsService)
        });
    })
    
    
    describe('DibsService Test - private methods', ()=>{
        /**
         * TEST METHOD : extractUserId
         */
        describe('extractUserId', ()=>{
            test('extractUserId method - success', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                const userId = 10;
                const testValue:AuthResult = {
                    result: true,
                    userId: userId,
                    authType: 'test'
                }
                expect(inst.testExtractUserId(testValue)).toBe(userId);
            });
            test('extractUserId method - fail : not matched user id', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                const userId = 10;
                const testValue:AuthResult = {
                    result: true,
                    userId: userId+1,
                    authType: 'test'
                }
                expect(inst.testExtractUserId(testValue)).not.toBe(userId);
            });
        
            test('extractUserId method - fail : throw exception', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                const testValue:AuthResult = {
                    result: true,
                    authType: 'test'
                }
                expect(()=>inst.testExtractUserId(testValue)).toThrow(cError);
            });
        })
        

        /**
         * TEST METHOD : extractItemId
         */
        describe('extractItemId', ()=>{
            test('extractItemId method - success', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                const itemId = 1;
                const arg:any = {
                    itemId: itemId
                }
                expect(inst.testExtractItemId(arg)).toBe(itemId);
            });
            test('extractItemId method - fail : not matched item id', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                const itemId = 1;
                const arg:any = {
                    itemId: 2
                }
                expect(inst.testExtractItemId(arg)).not.toBe(itemId);
            });
        
            test('extractItemId method - fail : throw exception', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                const arg:any = {
                }
                expect(()=>inst.testExtractItemId(arg)).toThrow(cError);
            });
        })
        
    
        /**
         * TEST METHOD : getDibsRepository
         */
        describe('getDibsRepository', ()=>{
            test('getDibsRepository method - success', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                
                expect(inst.testGetDibsRepository()).toBeInstanceOf(DibsRepository);
            });
        
            test('getDibsRepository method - fail : not matched user id', ()=>{
                let failedDummyRepo:DummyRepositories = {} as DummyRepositories;
                Object.assign(Object.create(dummyRepo), failedDummyRepo);
                failedDummyRepo.getRepository = ():RepoObjects => {
                    return {} as RepoObjects;
                }
                const inst = new dummyDibsServiceClass(failedDummyRepo, dummykakaoAPI, dummyMessageQueue);
                
                expect(()=>inst.testGetDibsRepository()).toThrow(cError);
            });  
        })

        /**
         * TEST METHOD : getItemRepository
         */
         describe('getItemRepository', ()=>{
            test('getItemRepository method - success', ()=>{
                const inst = new dummyDibsServiceClass(dummyRepo, dummykakaoAPI, dummyMessageQueue);
                
                expect(inst.testGetItemRepository()).toBeInstanceOf(ItemRepository);
            });
        
            test('getItemRepository method - fail : not matched user id', ()=>{
                let failedDummyRepo:DummyRepositories = {} as DummyRepositories;
                Object.assign(Object.create(dummyRepo), failedDummyRepo);
                failedDummyRepo.getRepository = ():RepoObjects => {
                    return {} as RepoObjects;
                }
                const inst = new dummyDibsServiceClass(failedDummyRepo, dummykakaoAPI, dummyMessageQueue);
                
                expect(()=>inst.testGetItemRepository()).toThrow(cError);
            });  
        })
    });
    
    
    describe('DibsService Test - public methods', ()=>{
        /**
         * TEST METHOD : getMyDibs
         */
        describe('DibsService Test - getMyDbs methods', ()=>{
            // Db values
            const userId = 10;
            const validStatus = 0; // 0=valid, 1=invalid
            const userDibs:Dibs[] = [{
                createdAt: '2022-09-01 00:00:00',
                id: 1,
                itemId: 120,
                status: validStatus,
                userId: userId
            }]
        
            // Mock
            class mockDibsRepositoryClass extends DibsRepository {
                async getDibsByUserId(userId:number): Promise<Dibs[]> {
                    if(userId !== 10){
                        return [] as Dibs[];
                    }
                    return userDibs.filter(item=>(item.status === validStatus));
                }
            }
            const mockedDibsRepo = new mockDibsRepositoryClass(dummyModels);
            const setMockedDibsRepo = (inst:DibsService, mockedDibsRepo:mockDibsRepositoryClass):DibsService => {
                inst.getRepositories = ():Repositories=>{
                    return {
                        getRepository: ():RepoObjects => {
                            try{
                                return {
                                    itemRepo: {} as ItemRepository,
                                    userRepo: {} as UserRepository,
                                    biddingRepo: {} as BiddingRepository, 
                                    penaltyRepo: {} as PenaltyRepository,
                                    alarmRepo: {} as AlarmRepository,
                                    dibsRepo: mockedDibsRepo
                                }
                            }catch(e){
                                // console.log('exception > getRepository : ', e);
                                throw e;
                            }
                        }
                    } as Repositories;
                }
                return inst;
            }
        
        
            test('getMyDibs method - success', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 10,
                    authType: 'test'
                }
                const expectedValue = userDibs;
                const arg:any = {}
                const selectionSetList:string[] = ['1','2','3','4'];
        
                // run testing
                const result = await inst.getMyDibs(authResult, arg, selectionSetList);
        
                // assess
                expect(result).toStrictEqual(expectedValue)
            });
        
            test('getMyDibs method - success : unknow user id', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 1,
                    authType: 'test'
                }
                const expectedValue:Dibs[] = [];
                const arg:any = {}
                const selectionSetList:string[] = ['1','2','3','4'];
        
                // run testing
                const result = await inst.getMyDibs(authResult, arg, selectionSetList);
        
                // assess
                expect(result).toStrictEqual(expectedValue)
            });
        
            test('getMyDibs method - success : no vaild item', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 1,
                    authType: 'test'
                }
                const expectedValue:Dibs[] = [];
                const arg:any = {}
                const selectionSetList:string[] = ['1','2','3','4'];
        
                // run testing
                const result = await inst.getMyDibs(authResult, arg, selectionSetList);
        
                // assess
                expect(result).toStrictEqual(expectedValue)
            });
        });


        /**
         * TEST METHOD : getDibsCount
         */
         describe('DibsService Test - getDibsCount methods', ()=>{
            // Db values
            const itemCount = 100;
        
            // Mock
            class mockDibsRepositoryClass extends DibsRepository {
                async getDibsCountByItemId(itemId:number): Promise<number> {
                    if(itemId === 10){
                        return itemCount;
                    }
                    return 0;
                }
            }
            const mockedDibsRepo = new mockDibsRepositoryClass(dummyModels);
            const setMockedDibsRepo = (inst:DibsService, mockedDibsRepo:mockDibsRepositoryClass):DibsService => {
                inst.getRepositories = ():Repositories=>{
                    return {
                        getRepository: ():RepoObjects => {
                            try{
                                return {
                                    itemRepo: {} as ItemRepository,
                                    userRepo: {} as UserRepository,
                                    biddingRepo: {} as BiddingRepository, 
                                    penaltyRepo: {} as PenaltyRepository,
                                    alarmRepo: {} as AlarmRepository,
                                    dibsRepo: mockedDibsRepo
                                }
                            }catch(e){
                                // console.log('exception > getRepository : ', e);
                                throw e;
                            }
                        }
                    } as Repositories;
                }
                return inst;
            }
        
        
            test('getDibsCount method - success', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 10,
                    authType: 'test'
                }

                const arg:any = {
                    itemId: 10
                }
                const selectionSetList:string[] = ['1','2','3','4'];
        
                // run testing
                const result = await inst.getDibsCount(authResult, arg, selectionSetList);
        
                // assess
                expect(result).toStrictEqual(itemCount);
            });
        
            test('getDibsCount method - success : no item id', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 10,
                    authType: 'test'
                }

                const arg:any = {
                    itemId: 11
                }
                const selectionSetList:string[] = ['1','2','3','4'];
        
                // run testing
                const result = await inst.getDibsCount(authResult, arg, selectionSetList);
        
                // assess
                expect(result).toStrictEqual(0);
            });
        });

        /**
         * TEST METHOD : getDibsCount
         */
        describe('DibsService Test - addDibs methods', ()=>{
            // Db values
            const userId:number = 10;
            const itemId:number = 20;
            const dummyItem:Item = {
                createdAt: '2022-09-01 00:00:00',
                id: itemId,
                status: 0,
                userId: 100
            }
            const addedDibs:Dibs = {
                createdAt: '2022-09-01 00:00:00',
                id: 1,
                itemId: itemId,
                status: 0,
                userId: userId
            }
        
            // Mock
            class mockDibsRepositoryClass extends DibsRepository {
                async addDibs(userId:number, itemId:number, transaction:Transaction): Promise<Maybe<Dibs>> {
                    if(userId === 10 && itemId === 20){
                        return addedDibs;
                    }
                    return null;
                }
            }
            class mockItemRepositoryClass extends ItemRepository {
                async getItem(itemId:number, include?:string[]): Promise<Item> {
                    // console.log('item repository : ', itemId)
                    if(itemId === 20){
                        return dummyItem;
                    }
                    return null as any;
                }
            }
            const mockedDibsRepo = new mockDibsRepositoryClass(dummyModels);
            const mockedItemRepo = new mockItemRepositoryClass(dummyModels);
            const setMockedDibsRepo = (inst:DibsService, 
                mockedDibsRepo:mockDibsRepositoryClass,
                mockedItemRepo:mockItemRepositoryClass
                ):DibsService => {
                inst.getRepositories = ():Repositories=>{
                    return {
                        getRepository: ():RepoObjects => {
                            try{
                                return {
                                    itemRepo: mockedItemRepo,
                                    userRepo: {} as UserRepository,
                                    biddingRepo: {} as BiddingRepository, 
                                    penaltyRepo: {} as PenaltyRepository,
                                    alarmRepo: {} as AlarmRepository,
                                    dibsRepo: mockedDibsRepo
                                }
                            }catch(e){
                                // console.log('exception > getRepository : ', e);
                                throw e;
                            }
                        }
                    } as Repositories;
                }
                return inst;
            }
        
        
            test('addDibs method - success', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo, mockedItemRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 10,
                    authType: 'test'
                }

                const arg:any = {
                    itemId: 20
                }
                const selectionSetList:string[] = ['1'];
        
                // run testing
                const result = await inst.addDibs(authResult, arg, selectionSetList);
                // console.log(result);
        
                // assess
                const expectedResult = addedDibs;
                expect(result).toStrictEqual(expectedResult);
            });

            test('addDibs method - not found item (fail)', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo, mockedItemRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 10,
                    authType: 'test'
                }

                const arg:any = {
                    itemId: 2
                }
                const selectionSetList:string[] = ['1'];
                await expect(inst.addDibs(authResult, arg, selectionSetList)).rejects.toThrow(cError);
            });

            test('addDibs method - could not add due to unknow userId(fail)', async ()=>{
                // create instance
                const inst = setMockedDibsRepo(new DibsService(dummyRepo, dummykakaoAPI, dummyMessageQueue), mockedDibsRepo, mockedItemRepo);
        
                // input value
                const authResult:AuthResult = {
                    result: true,
                    userId: 1,
                    authType: 'test'
                }

                const arg:any = {
                    itemId: 20
                }
                const selectionSetList:string[] = ['1'];
                await expect(inst.addDibs(authResult, arg, selectionSetList)).rejects.toThrow(cError);
            });
        
        });
    })

    
})
