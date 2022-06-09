// import { UserRepository } from '../../repository/userRepository';
// import { UserService } from '../index'
// import { User } from '../../types'
// import { Models } from '../../repository/model'


// // TODO : Shoud write Unit Test. Currently it's not unit test, just example.

// describe('userService Test ', ()=>{
    
//     test('userService jest mock getUser - mocked ', async()=>{
//         let dummyUser:User = {
//             id: 1,
//             status: 0,
//             createdAt: ''
//         }
//         // Mocking getUser of UserRepository
//         const getUserMock = jest
//             .spyOn(UserRepository.prototype, 'getUser')
//             .mockImplementation(async (userId:number):Promise<User>=>{
//                 if(userId === 0){
//                     return dummyUser;
//                 }
//                 // console.log('mocked method');
//                 return {
//                     id: 0,
//                     status: 1,
//                     createdAt: ''
//                 };
//             });

//         let inst:UserService = new UserService(()=>{});
//         const result = await inst.getUser(0);
//         // console.log('result : ', result);

//         expect(result).toBe(dummyUser);
//         expect(getUserMock).toHaveBeenCalled();
//     })

//     test('userService jest mock getUser - mocked ', async()=>{
//         let dummyUser:User = {
//             id: 1,
//             status: 0,
//             createdAt: ''
//         }
//         // Mocking getUser of UserRepository
//         const getUserMock = jest
//             .spyOn(UserRepository.prototype, 'getUser')
//             .mockImplementation(async (userId:number):Promise<User>=>{
//                 if(userId === 0){
//                     return dummyUser;
//                 }
//                 // console.log('mocked method');
//                 return {
//                     id: 0,
//                     status: 1,
//                     createdAt: ''
//                 };
//             });

//         let inst:UserService = new UserService(()=>{});
//         const result = await inst.getUser(1);
//         // console.log('result : ', result);

//         expect(result.id).toBe(0);
//         expect(result.status).toBe(1);
//         expect(getUserMock).toHaveBeenCalled();
//     })

//     test('userService mocke property getUser:', async ()=>{
//         let dummyUser:User = {
//             id: 1,
//             status: 0,
//             createdAt: ''
//         }

//         let repo = new UserRepository({} as Models);
//         // Mocking property
//         repo.getUser = async (userId:number): Promise<User> =>{
//             console.log('Mocked method')
//             if(userId === 0){
//                 return dummyUser;
//             }
//             return {id:1, status: 0, createdAt: ''};
//         }
//         let inst:UserService = new UserService(()=>{
//             return {
//                 userRepo: repo
//             }
//         });
//         let result = await inst.getUser(0);
//         expect(result).toBe(dummyUser)
//     })
// })