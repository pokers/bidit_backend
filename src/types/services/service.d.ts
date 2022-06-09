import {UserService, ItemService} from '../../services'
export type Maybe<T> = T | null;

// export type Services = {
//     [key: string]: any;
//     userService?: Maybe<UserService>;
//     itemService?: Maybe<ItemService>;
// }

export type ResolverServices<T> = T;
export type UserResolverService = {
    [key: string]: any;
    userService: UserService;
    itemService: ItemService;
}

export type ItemResolverService = {
    [key: string]: any;
    userService: UserService;
    itemService: ItemService;
}

