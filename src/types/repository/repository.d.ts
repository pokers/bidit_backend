import { ItemRepository, UserRepository } from "../../repository";
import { CategoryQueryInput, ItemQueryInput } from "../schema/schema.type";

export type Maybe<T> = T | null;
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
    itemRepo?: ItemRepository;
    userRepo?: UserRepository;
}
