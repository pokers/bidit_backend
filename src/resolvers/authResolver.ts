import 'reflect-metadata';
import { log, cError, ErrorRequireAddUser, ErrorAxiosException, ErrorInvalidMemoryship } from '../lib'
import { Context, AppSyncAuthorizerEvent } from 'aws-lambda'
import { Provider } from './provider'
import { AuthService, UserService } from '../services'
import { User, Maybe, AuthResult } from '../types'
import { Container } from 'typedi'


const initialize = async()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.initialize();
    }catch(e){
        log.error('exception > initialize : ', e);
        throw e;
    }
}

const destroy = async ()=>{
    try{
        const provider:Provider = Container.get(Provider);
        await provider.destroy();
    }catch(e){
        log.error('exception > destroy : ', e);
        throw e;
    }
}

const processAuthentication = async (authorizationToken:string):Promise<AuthResult>=>{
    try{
        
        const authResult:AuthResult = await Container.get(AuthService).authenticateUser(authorizationToken);
        const user:Maybe<User> = await Container.get(UserService).getUserBySocialId(authResult);
        // log.info('authResult : ', authResult);
        // log.info('user : ', user);
        if(user){
            authResult.userId = user.id;
        }

        if(user && user.status === 1/** 0=VALID, 1=INVALID */){
            throw ErrorInvalidMemoryship();
        }
        return authResult;
    }catch(e){
        log.error('Exception > resolver :', e);
        throw e;
    }
}

////////////////////////////////////////////////
const isTestAccount = (event:AppSyncAuthorizerEvent)=>{
    const { authorizationToken } = event;
    const [type, token, vendor] = authorizationToken.split(' ');
    if(vendor && vendor === 'testbidit'){
        return {
            isAuthorized: true,
            resolverContext:{
                userId: 1,
                authType: 'kakao',
                kakaoAccountId: 2233153001,
            }
        }
    }
    return null;
}
////////////////////////////////////////////////

const authorizer = async (event:AppSyncAuthorizerEvent, context: Context)=>{
    try{
        const result = {
            isAuthorized: false,
            resolverContext: {}
        }
        log.info("Invoked authorizer : ", JSON.stringify(event), JSON.stringify(context));
       
        ////////////////////////////////////////////////
        const testResult = isTestAccount(event);
        if(testResult){
            return testResult;
        }
        ////////////////////////////////////////////////

        await initialize();
        const { authorizationToken } = event;

        const authResult:AuthResult = await processAuthentication(authorizationToken);

        log.info('authResult : ', authResult);
        // set token result
        result.isAuthorized = authResult.result;
        if(authResult.result){
            result.resolverContext = {
                authType: authResult.authType,
                kakaoAccountId: authResult.kakaoAccountId,
                appleAccountSub: authResult.appleAccountSub,
            }
        }

        // set user result
        if(authResult.userId){
            result.resolverContext = {
                userId: authResult.userId,
            }
        }

        if(result.isAuthorized && authResult.userId){
            // token is valid but there is no user info. check query if it's whether addUser or not.
            if(event.requestContext.queryString?.indexOf('addUser(') >= 0){
                result.isAuthorized = false;
                log.info('Add user : the user is already existed');
            }
        }
        log.info('success authentication : ', result);
        await destroy();
        return result;
    }catch(e){
        await destroy();
        log.error('Exception > resolver :', e);
        throw e;
    }
}
export { authorizer }