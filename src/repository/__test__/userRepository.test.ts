import { AuroraMySql } from '../../lib/auroraMySql'
import { UserRepository } from '../../repository/userRepository';
import { User } from '../../types'

const dummyUsers:User[] = [{
    id:0,
    status: 1,
    createdAt: '',
},
{
    id: 1,
    status: 2,
    createdAt: ''
}]


jest.mock('../../lib/auroraMySql', ()=>{
    return {
        AuroraMySql: jest.fn().mockImplementation(()=>{
            return {
                createConnection: async ()=>{
                    // console.log('mocked createConnection');
                },
                query: async (query:string)=>{
                    // console.log('mocked query : ', query);
                    return dummyUsers;
                },
                end: async ()=>{
                    // console.log('mocked end');
                }
            }
        })
    }
})

// TODO : Shoud write Unit Test. Currently it's not unit test, just example.
describe('userRepository Test ', ()=>{
    test('getUser', async ()=>{
        // Mocking auroraMySql
    })
})