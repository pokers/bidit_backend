export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  BIGINT: any;
};

export type Category = {
  __typename?: 'Category';
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  depth?: Maybe<Scalars['Int']>;
  id: Scalars['Int'];
  name?: Maybe<Scalars['String']>;
  parent?: Maybe<Category>;
  parentId?: Maybe<Scalars['Int']>;
  status: Scalars['Int'];
  updatedAt?: Maybe<Scalars['String']>;
};

export type CategoryConnection = {
  __typename?: 'CategoryConnection';
  edges?: Maybe<Array<Maybe<CategoryEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type CategoryEdge = {
  __typename?: 'CategoryEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Category>;
};

export type CategoryQueryInput = {
  depth?: InputMaybe<Scalars['Int']>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  parentId?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['Int']>;
};

export enum CategoryStatus {
  Invalid = 'INVALID',
  Valid = 'VALID'
}

export enum DeliveryType {
  Both = 'BOTH',
  Direct = 'DIRECT',
  Parcel = 'PARCEL'
}

export type Item = {
  __typename?: 'Item';
  aCondition?: Maybe<Scalars['Int']>;
  buyNow?: Maybe<Scalars['Int']>;
  cPrice?: Maybe<Scalars['Int']>;
  category?: Maybe<Category>;
  categoryId?: Maybe<Scalars['Int']>;
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  deliveryType?: Maybe<Scalars['Int']>;
  description?: Maybe<Array<Maybe<ItemDescription>>>;
  dueDate?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  image?: Maybe<Array<Maybe<ItemImage>>>;
  name?: Maybe<Scalars['String']>;
  sCondition?: Maybe<Scalars['Int']>;
  sPrice?: Maybe<Scalars['Int']>;
  status: Scalars['Int'];
  title?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  userId: Scalars['Int'];
};

export type ItemConnection = {
  __typename?: 'ItemConnection';
  edges?: Maybe<Array<Maybe<ItemEdge>>>;
  pageInfo?: Maybe<PageInfo>;
  totalCount?: Maybe<Scalars['Int']>;
};

export type ItemDescription = {
  __typename?: 'ItemDescription';
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  itemId: Scalars['Int'];
  status: Scalars['Int'];
  type?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export type ItemEdge = {
  __typename?: 'ItemEdge';
  cursor?: Maybe<Scalars['String']>;
  node?: Maybe<Item>;
};

export type ItemImage = {
  __typename?: 'ItemImage';
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  itemId: Scalars['Int'];
  status: Scalars['Int'];
  type?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['String']>;
  url?: Maybe<Scalars['String']>;
};

export type ItemQueryInput = {
  aCondition?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  createdAt?: InputMaybe<Scalars['Int']>;
  deliveryType?: InputMaybe<Scalars['Int']>;
  dueDate?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  name?: InputMaybe<Scalars['String']>;
  sCondition?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
};

export enum ItemStatus {
  Ongoing = 'ONGOING',
  Registed = 'REGISTED',
  Sold = 'SOLD'
}

export enum JoinPath {
  Apple = 'APPLE',
  Google = 'GOOGLE',
  Kakao = 'KAKAO'
}

export type KakaoAccount = {
  __typename?: 'KakaoAccount';
  age_range?: Maybe<Scalars['String']>;
  age_range_needs_agreement?: Maybe<Scalars['Boolean']>;
  birthday?: Maybe<Scalars['String']>;
  birthday_needs_agreement?: Maybe<Scalars['Boolean']>;
  birthday_type?: Maybe<Scalars['String']>;
  birthyear?: Maybe<Scalars['String']>;
  birthyear_needs_agreement?: Maybe<Scalars['Boolean']>;
  ci?: Maybe<Scalars['String']>;
  ci_authenticated_at?: Maybe<Scalars['String']>;
  ci_needs_agreement?: Maybe<Scalars['Boolean']>;
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_needs_agreement?: Maybe<Scalars['Boolean']>;
  gender?: Maybe<Scalars['String']>;
  gender_needs_agreement?: Maybe<Scalars['Boolean']>;
  id: Scalars['BIGINT'];
  is_default_image?: Maybe<Scalars['Boolean']>;
  is_email_valid?: Maybe<Scalars['Boolean']>;
  is_email_verified?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  name_needs_agreement?: Maybe<Scalars['Boolean']>;
  nickname?: Maybe<Scalars['String']>;
  phone_number?: Maybe<Scalars['String']>;
  phone_number_needs_agreement?: Maybe<Scalars['Boolean']>;
  profile_image_needs_agreement?: Maybe<Scalars['Boolean']>;
  profile_image_url?: Maybe<Scalars['String']>;
  profile_needs_agreement?: Maybe<Scalars['Boolean']>;
  profile_nickname_needs_agreement?: Maybe<Scalars['Boolean']>;
  status: Scalars['Int'];
  thumbnail_image_url?: Maybe<Scalars['String']>;
  updatedAt: Scalars['String'];
  userId: Scalars['Int'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addUser?: Maybe<User>;
};


export type MutationAddUserArgs = {
  vendor?: InputMaybe<Scalars['String']>;
};

export type PageInfo = {
  __typename?: 'PageInfo';
  endCursor?: Maybe<Scalars['String']>;
  hasNextPage?: Maybe<Scalars['Boolean']>;
  hasPrevPage?: Maybe<Scalars['Boolean']>;
  startCursor?: Maybe<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  getCategory?: Maybe<Category>;
  getCategoryList?: Maybe<CategoryConnection>;
  getItem?: Maybe<Item>;
  getItemList?: Maybe<ItemConnection>;
  getUser?: Maybe<User>;
  scanCategory?: Maybe<Array<Maybe<Category>>>;
};


export type QueryGetCategoryArgs = {
  id: Scalars['Int'];
};


export type QueryGetCategoryListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  categoryQuery?: InputMaybe<CategoryQueryInput>;
  first?: InputMaybe<Scalars['Int']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryGetItemArgs = {
  id: Scalars['Int'];
};


export type QueryGetItemListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  first?: InputMaybe<Scalars['Int']>;
  itemQuery?: InputMaybe<ItemQueryInput>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryGetUserArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  KakaoAccount?: Maybe<KakaoAccount>;
  birth?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  id: Scalars['Int'];
  items?: Maybe<ItemConnection>;
  joinPath?: Maybe<JoinPath>;
  passwd?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  status: Scalars['Int'];
  uniqueId?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
};

export enum UserStatus {
  Invalid = 'INVALID',
  Valid = 'VALID'
}

export enum Gender {
  Female = 'FEMALE',
  Male = 'MALE'
}