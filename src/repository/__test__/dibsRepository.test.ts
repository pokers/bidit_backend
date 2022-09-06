import { Model, Sequelize, Transaction, UniqueConstraintError } from 'sequelize'
import { SequelizeORM } from '../../lib/SequelizeORM';
import { Models, ModelName, DibsRepository, DibsModel } from '../../repository';
import { Dibs } from '../../types'
import { cError } from '../../lib'


type queryWhere = {
    userId: number
}
type queryOptions = {
    where: queryWhere,
    include: any
}
type inputType = {
    plain: Boolean
}

const dummyDibs:Dibs[] = [{
    id: 1,
    status: 0,
    userId: 10,
    itemId: 1,
    createdAt: '2022-09-05 00:00:00',
},{
    id: 2,
    status: 0,
    userId: 10,
    itemId: 2,
    createdAt: '2022-09-06 00:00:00'
}]

const dummyDibsModelData:DibsModel[] = [{
    get: (input:inputType)=>{
        if(input.plain){
            return dummyDibs[0];
        }
        return [];
    }
},{
    get: (input:inputType)=>{
        if(input.plain){
            return dummyDibs[1];
        }
        return []
    }
}] as DibsModel[];

/**
 * mocking example.
 * In this test spec, it would use spyOn function instead of mocking class
 */
// const mockedSequelizeORM = {
//     getDBInstance: ():Sequelize =>{
//         return {} as Sequelize;
//     },
//     isConnected: ():Boolean => {
//         return true;
//     },
//     startTransaction: async ():Promise<Transaction> => {
//         return {} as Transaction;
//     },
//     commit: async (transaction:Transaction) => {
//     },
//     rollback: async (transaction:Transaction) => {
//     },
//     close: async () => {
//     },
//     initialize: async (secretId: string): Promise<SequelizeORM> => {
//         return {} as SequelizeORM;
//     }
// }

// const mockedModels = {
//     initialize: ():Models => {
//         return {} as Models;
//     },
//     associateHasMany: ():Models => {
//         return {} as Models;
//     },
//     startTransaction: async ():Promise<Transaction> => {
//         return {} as Transaction;
//     },
//     commit: async (transaction:Transaction) => {
//         return {} as Transaction;
//     },
//     rollback: async (transaction:Transaction) =>{
//     },

//     getModel: (name:ModelName):any => {
//         if(name === ModelName.dibs){
//             return {
//                 findAll: (query: dbQuery)=>{
//                     if(query.where.userId === 10){
//                         return dummyModels;
//                     }
//                     if(query.where.userId === 20){
//                         return null;
//                     }
//                     return [];
//                 }
//             }
//         }
//         return;
//     },
//     query: async (query:string):Promise<any> => {
//         return {} as any;
//     },
// }

// jest.mock('../../lib/SequelizeORM', ()=>{
//     const org = jest.requireActual('../../lib/SequelizeORM');
//     return {
//         __esModule: true,
//         ...org,
//         SequelizeORM: jest.fn().mockImplementation(()=>mockedSequelizeORM)
//     }
// });

// jest.mock('../model/models', ()=>{
//     const org = jest.requireActual('../model/models');
//     return {
//         __esModule: true,
//         ...org,
//         Models: jest.fn().mockImplementation(()=>mockedModels)
//     }
// })

describe('dibsRepository Test ', ()=>{
    let spyingModelsGetModel = jest.spyOn(Models.prototype, 'getModel');
    let spyingDibsModelFindAll = jest.spyOn(DibsModel, 'findAll');
    let spyingDibsModelCount = jest.spyOn(DibsModel, 'count');
    let spyingDibsModelCreate = jest.spyOn(DibsModel, 'create');

    beforeEach(()=>{
        spyingModelsGetModel.mockRestore();
        spyingModelsGetModel = jest.spyOn(Models.prototype, 'getModel');

        spyingDibsModelFindAll.mockRestore();
        spyingDibsModelFindAll = jest.spyOn(DibsModel, 'findAll');

        spyingDibsModelCount.mockRestore();
        spyingDibsModelCount = jest.spyOn(DibsModel, 'count');

        spyingDibsModelCreate.mockRestore();
        spyingDibsModelCreate = jest.spyOn(DibsModel, 'create');
    });
    
    describe('Instance Test', ()=>{
        const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
        const dummyModels = new Models(dummySequelizeORM)

        test('instance initialize', async ()=>{
            const inst = new DibsRepository(dummyModels);
            expect(inst).toBeTruthy();
        })
    })

    describe('Private method Test', ()=>{
        
    })

    describe('Public method Test', ()=>{

        /************************************************************
         * TEST : getDibsByUserId
         ************************************************************/
        describe('getDibsByUserId', ()=>{

            test('getDibsByUserId : matched expected result (success)', async ()=>{
                // mocking
                spyingDibsModelFindAll.mockImplementation(async (query:any):Promise<Model[]>=>{
                    if(query.where.userId === 10){
                        return dummyDibsModelData as any;
                    }
                    return [];
                });
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                const userId:number = 10;
                const result = await inst.getDibsByUserId(userId);
                // console.log(result);

                expect(result).toStrictEqual(dummyDibs);
            })

            test('getDibsByUserId : not found userId - empty array result (success)', async ()=>{
                // mocking
                spyingDibsModelFindAll.mockImplementation(async (query:any):Promise<Model[]>=>{
                    if(query.where.userId === 10){
                        return dummyDibsModelData as any;
                    }
                    return [];
                });

                // dummy data
                const userId:number = 11;
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                const result = await inst.getDibsByUserId(userId);
                // console.log(result);

                expect(result).toStrictEqual([]);
            })

            test('getDibsByUserId : throw TypeError exception on models (fail)', async ()=>{
                // mocking
                spyingDibsModelFindAll.mockImplementation(async (query:any):Promise<Model[]>=>{
                    if(query.where.userId === 10){
                        return dummyDibsModelData as any;
                    }
                    if(query.where.userId === 20){
                        return null as any;
                    }
                    return [];
                });

                const userId:number = 20;
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                
                await expect(inst.getDibsByUserId(userId)).rejects.toThrow(TypeError);
            })

            test('getDibsByUserId : throw cError exception on models (fail)', async ()=>{
                spyingDibsModelFindAll.mockImplementation(async (query:any):Promise<Model[]>=>{
                    if(query.where.userId === 10){
                        return dummyDibsModelData as any;
                    }
                    if(query.where.userId === 20){
                        return null as any;
                    }
                    if(query.where.userId === 21){
                        throw new cError(0, 'dummy')
                    }
                    return [];
                });
                const userId:number = 21;
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                
                await expect(inst.getDibsByUserId(userId)).rejects.toThrow(cError);
            })
        })


        describe('getDibsCountByItemId', ()=>{
            /************************************************************
             * TEST : getDibsCountByItemId
             ************************************************************/
            test('getDibsCountByItemId : matched expected result (success)', async ()=>{
                // mocking
                const expectedValue = 100;
                spyingDibsModelCount.mockImplementation(async (query:any):Promise<number>=>{
                    if(query.where.itemId === 10){
                        return expectedValue;
                    }
                    return 0;
                });
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                const itemId:number = 10;
                const result = await inst.getDibsCountByItemId(itemId);
                // console.log(result);

                expect(result).toStrictEqual(expectedValue);
            })

            test('getDibsCountByItemId : return zero due to none item id (fail)', async ()=>{
                // mocking
                const expectedValue = 100;
                spyingDibsModelCount.mockImplementation(async (query:any):Promise<number>=>{
                    if(query.where.itemId === 10){
                        return expectedValue;
                    }
                    return 0;
                });
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                const itemId:number = 1;
                const result = await inst.getDibsCountByItemId(itemId);
                // console.log(result);

                expect(result).toStrictEqual(0);
            })

            test('getDibsCountByItemId : throw cError exception on models (fail)', async ()=>{
                // mocking
                const expectedValue = 100;
                spyingDibsModelCount.mockImplementation(async (query:any):Promise<number>=>{
                    if(query.where.itemId === 10){
                        return expectedValue;
                    }
                    if(query.where.itemId === 2){
                        throw new cError(0, 'dummmy')
                    }
                    return 0;
                });
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                const itemId:number = 2;
                await expect(inst.getDibsCountByItemId(itemId)).rejects.toThrow(cError);
            })
        })


        /************************************************************
         * TEST : addDibs
         ************************************************************/
        describe('addDibs', ()=>{
            const userId:number = 10;
            const itemId:number = 20;
            const dummyDibs = {
                createdAt: '2022-09-01 00:00:00',
                id: 1,
                itemId: itemId,
                status: 0,
                userId: userId
            };
            const dummyDibsModel = {
                ...dummyDibs,
                get: ({})=>{
                    return dummyDibs
                }
            }
            test('addDibs : matched expected result (success)', async ()=>{
                // mocking
                const expectedValue = dummyDibs;
                spyingDibsModelCreate.mockImplementation(async (value:any):Promise<Dibs>=>{
                    if(value.userId === 10 && value.itemId === 20){
                        return dummyDibsModel;
                    }
                    return null as any;
                });
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                const result = await inst.addDibs(userId, itemId, {} as Transaction);
                // console.log(result);

                expect(result).toStrictEqual(expectedValue);
            })

            test('addDibs : invalid item id, throw exception', async ()=>{
                // mocking
                const expectedValue = dummyDibs;
                spyingDibsModelCreate.mockImplementation(async (value:any):Promise<Dibs>=>{
                    if(value.userId === 10 && value.itemId === 20){
                        return dummyDibsModel;
                    }
                    return null as any;
                });
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                await expect(inst.addDibs(userId, 10, {} as Transaction)).rejects.toThrow(cError);
            })

            

            test('addDibs : invalid user id, throw exception (fail)', async ()=>{
                // mocking
                const expectedValue = dummyDibs;
                spyingDibsModelCreate.mockImplementation(async (value:any):Promise<Dibs>=>{
                    if(value.userId === 10 && value.itemId === 20){
                        return dummyDibsModel;
                    }
                    return null as any;
                });
                
                // initialize instances
                const dummySequelizeORM = new SequelizeORM('dibsRepository unit test')
                const dummyModels = new Models(dummySequelizeORM)
                const inst = new DibsRepository(dummyModels);

                // run
                await expect(inst.addDibs(1, itemId, {} as Transaction)).rejects.toThrow(cError);
            })
        })
    })
})