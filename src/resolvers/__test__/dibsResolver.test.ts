import { AppSyncResolverEvent, Context, AppSyncIdentityLambda } from 'aws-lambda'
import {
    AuthResult,
    Dibs
} from '../../types'
import { cError } from '../../lib'
import * as DibsResolver from '../dibsResolver'
import { DibsService } from '../../services'


describe('dibsResolver.dibsResolver Test', ()=>{
    // mocking
    let mockedInitialize = jest.spyOn(DibsResolver, 'initialize')
    let mockedDestroy = jest.spyOn(DibsResolver, 'destroy')
    let mockedExtractIdentity = jest.spyOn(DibsResolver, 'extractIdentity')
    let mockedGetMyDibs = jest.spyOn(DibsService.prototype, 'getMyDibs');
    let mockedGetDibsCount = jest.spyOn(DibsService.prototype, 'getDibsCount');
    let mockAddDibs = jest.spyOn(DibsService.prototype, 'addDibs');

    beforeEach(()=>{
        // console.log('clear...')
        mockedInitialize.mockRestore();
        mockedInitialize = jest.spyOn(DibsResolver, 'initialize');

        mockedDestroy.mockRestore();
        mockedDestroy = jest.spyOn(DibsResolver, 'destroy');

        mockedExtractIdentity.mockRestore();
        mockedExtractIdentity = jest.spyOn(DibsResolver, 'extractIdentity')
        
        mockedGetMyDibs.mockRestore();
        mockedGetMyDibs = jest.spyOn(DibsService.prototype, 'getMyDibs');

        mockedGetDibsCount.mockRestore();
        mockedGetDibsCount = jest.spyOn(DibsService.prototype, 'getDibsCount');

        mockAddDibs.mockRestore();
        mockAddDibs = jest.spyOn(DibsService.prototype, 'addDibs');
    });

    test('dibsResolver - run and Do nothing : success', async ()=>{
        // mocking
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        mockedExtractIdentity.mockImplementation((event:AppSyncResolverEvent<any, any>):AppSyncIdentityLambda=>{
            // console.log('Called extractIdentity...')
            return {} as AppSyncIdentityLambda;
        });
        
        // dummy values
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            info:{
                fieldName: 'default'
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        expect(result).toStrictEqual(undefined);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })

    test('dibsResolver - run : success', async ()=>{
        // mocking
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        
        // dummy values
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            identity:{
                resolverContext: {
                    userId: 1
                }
            } as AppSyncIdentityLambda,
            info:{
                fieldName: 'default'
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        expect(result).toStrictEqual(undefined);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })


    test('dibsResolver - run : invalid identity data (fail)', async ()=>{
        // mocking
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        
        // dummy values
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            info:{
                fieldName: 'default'
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;

        await expect(DibsResolver.dibsResolver(dummyEvent, dummyContext)).rejects.toThrow(cError);
        expect(mockedInitialize).toBeCalledTimes(0);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })

    test('dibsResolver - run : expected result value (success)', async ()=>{
        // dummy values
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            identity:{
                resolverContext: {
                    userId: 1
                }
            } as AppSyncIdentityLambda,
            info:{
                fieldName: 'getMyDibs'
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;
        const dummyUserDibs:Dibs[] = [{
            createdAt: '2022-09-01 00:00:00',
            id: 1,
            itemId: 120,
            status: 0,
            userId: 1
        }]

        // mocking & spying
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        mockedGetMyDibs.mockImplementation(async (authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Dibs[]>=>{
            if(authInfo.userId === 1){
                return dummyUserDibs;
            }
            return [];
        })

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        const expectedResult = dummyUserDibs;
        expect(result).toStrictEqual(expectedResult);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })

    test('dibsResolver - run : unknown user id (fail)', async ()=>{
        // dummy values
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            identity:{
                resolverContext: {
                    userId: 10
                }
            } as AppSyncIdentityLambda,
            info:{
                fieldName: 'getMyDibs'
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;
        const dummyUserDibs:Dibs[] = [{
            createdAt: '2022-09-01 00:00:00',
            id: 1,
            itemId: 120,
            status: 0,
            userId: 1
        }]

        // mocking & spying
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        mockedGetMyDibs.mockImplementation(async (authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Dibs[]>=>{
            if(authInfo.userId === 1){
                return dummyUserDibs;
            }
            return [];
        })

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        const expectedResult:Dibs[] = [];
        expect(result).toStrictEqual([]);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })

    test('dibsResolver - run with getDibsCount field : result value (success)', async ()=>{
        // dummy values
        const dummyDibsCount = 100;
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            identity:{
                resolverContext: {
                    userId: 10
                }
            } as AppSyncIdentityLambda,
            info:{
                fieldName: 'getDibsCount'
            },
            arguments:{
                itemId: 10
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;

        // mocking & spying
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        mockedGetDibsCount.mockImplementation(async (authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<number>=>{
            if(arg.itemId === 10){
                return dummyDibsCount;
            }
            return 0;
        })

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        const expectedResult = dummyDibsCount;
        expect(result).toStrictEqual(expectedResult);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })

    test('dibsResolver - run with getDibsCount field : none item id (success)', async ()=>{
        // dummy values
        const dummyDibsCount = 100;
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            identity:{
                resolverContext: {
                    userId: 10
                }
            } as AppSyncIdentityLambda,
            info:{
                fieldName: 'getDibsCount'
            },
            arguments:{
                itemId: 100
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;

        // mocking & spying
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        mockedGetDibsCount.mockImplementation(async (authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<number>=>{
            if(arg.itemId === 10){
                return dummyDibsCount;
            }
            return 0;
        })

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        const expectedResult = 0;
        expect(result).toStrictEqual(expectedResult);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })


    test('dibsResolver - run with addDibs field : result value (success)', async ()=>{
        // dummy values
        const userId:number = 10;
        const itemId:number = 20;
        const dummyDibs = {
            createdAt: '2022-09-01 00:00:00',
            id: 1,
            itemId: itemId,
            status: 0,
            userId: userId
        };
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            identity:{
                resolverContext: {
                    userId: 10
                }
            } as AppSyncIdentityLambda,
            info:{
                fieldName: 'addDibs'
            },
            arguments:{
                itemId: 20
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;

        // mocking & spying
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        mockAddDibs.mockImplementation(async (authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Dibs>=>{
            if(authInfo.userId === 10 && arg.itemId === 20){
                return dummyDibs;
            }
            return null as any;
        })

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        const expectedResult = dummyDibs;
        expect(result).toStrictEqual(expectedResult);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })

    test('dibsResolver - run with addDibs field : invalid itemId (fail)', async ()=>{
        // dummy values
        const userId:number = 10;
        const itemId:number = 20;
        const dummyDibs = {
            createdAt: '2022-09-01 00:00:00',
            id: 1,
            itemId: itemId,
            status: 0,
            userId: userId
        };
        const dummyEvent:AppSyncResolverEvent<any, any> = {
            identity:{
                resolverContext: {
                    userId: 10
                }
            } as AppSyncIdentityLambda,
            info:{
                fieldName: 'addDibs'
            },
            arguments:{
                itemId: 10
            }
        } as AppSyncResolverEvent<any, any>;
        const dummyContext:Context = {} as Context;

        // mocking & spying
        mockedInitialize.mockImplementation(async ()=>{
            // console.log('Called initialize...')
        });
        mockedDestroy.mockImplementation(async ()=>{
            // console.log('Called destroy...')
        });
        mockAddDibs.mockImplementation(async (authInfo:AuthResult, arg: any, selectionSetList:string[]): Promise<Dibs>=>{
            if(authInfo.userId === 10 && arg.itemId === 20){
                return dummyDibs;
            }
            return null as any;
        })

        // run
        const result = await DibsResolver.dibsResolver(dummyEvent, dummyContext);
        // console.log(result);

        // assess
        const expectedResult = null;
        expect(result).toStrictEqual(expectedResult);
        expect(mockedInitialize).toBeCalledTimes(1);
        expect(mockedDestroy).toBeCalledTimes(1);
        expect(mockedExtractIdentity).toBeCalledTimes(1);
    })

})