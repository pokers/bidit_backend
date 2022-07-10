
// libs
export * from './lib/auroraMySql'

// schema
export * from './schema'


import {Maybe, User} from './schema/index'
import { KakaoUserInfo, AppleIdTokenType } from '../lib'

export type AuthResult = {
    result: boolean;
    userId?: Maybe<number>;
    authType: string;
    kakaoAccountId?: Maybe<number>;
    appleAccountSub?: Maybe<string>;
    user?: Maybe<User>;
}

export type UserInfoResult = {
    result: boolean;
    vendor: string;
    data?: Maybe<KakaoUserInfo|AppleIdTokenType>;
}

import { ItemRepository, UserRepository } from "../repository";
import { CategoryQueryInput, ItemQueryInput } from "./schema";

export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };

export type FirstLastItem<T> = {
    first: Maybe<T>;
    last: Maybe<T>;
}

export type QueryInput =  ItemQueryInput | CategoryQueryInput;

export type Repos ={
    [key: string]: any;
    itemRepo?: Maybe<ItemRepository>;
    userRepo?: Maybe<UserRepository>;
}
