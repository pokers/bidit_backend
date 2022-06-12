import 'reflect-metadata';
import { log, cError, ErrorRequireAddUser } from '../lib'
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
        log.error('exception > getUser : ', e);
        throw e;
    }
}

const processAuthentication = async (authorizationToken:string):Promise<AuthResult>=>{
    try{
        
        const authResult:AuthResult = await Container.get(AuthService).authenticateUser(authorizationToken);
        const user:Maybe<User> = await Container.get(UserService).getUserBySocialId(authResult);
        log.info('authResult : ', authResult);
        log.info('user : ', JSON.stringify(user));
        if(user){
            authResult.userId = user.id;
        }
        return authResult;
    }catch(e){
        log.error('Exception > resolver :', e);
        throw e;
    }
}

const authorizer = async (event:AppSyncAuthorizerEvent, context: Context)=>{
    try{
        const result = {
            isAuthorized: false,
            resolverContext: {}
        }
        log.info("Invoked authorizer : ", JSON.stringify(event), JSON.stringify(context));
       
        await initialize();
        const { authorizationToken } = event;
        const authResult:AuthResult = await processAuthentication(authorizationToken);

        log.info('authResult : ', authResult);
        // set token result
        result.isAuthorized = authResult.result;
        if(authResult.result){
            result.resolverContext = {
                authType: authResult.authType
            }
        }

        // set user result
        if(authResult.userId){
            result.resolverContext = {
                userId: authResult.userId,
                kakaoAccountId: authResult.kakaoAccountId,
                appleAccountId: authResult.appleAccountId,
            }
        }

        if(result.isAuthorized && authResult.userId){
            // token is valid but there is no user info. check query if it's whether addUser or not.
            if(event.requestContext.queryString?.indexOf('addUser') >= 0){
                result.isAuthorized = false;
                log.info('Add user : the user is already existed');
            }
        }

        log.info('success authentication : ', result);
        return result;
    }catch(e){
        log.error('Exception > resolver :', e);
        throw e;
    }
}
export { authorizer }