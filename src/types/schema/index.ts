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
  Long: any;
};

export type BidInput = {
  itemId: Scalars['Int'];
  price: Scalars['Int'];
  status?: InputMaybe<Scalars['Int']>;
};

export type Bidding = {
  __typename?: 'Bidding';
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  item?: Maybe<Item>;
  itemId: Scalars['Int'];
  price: Scalars['Int'];
  status: Scalars['Int'];
  user?: Maybe<User>;
  userId: Scalars['Int'];
};

export type BiddingQueryInput = {
  itemId?: InputMaybe<Scalars['Int']>;
  price?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['Int']>;
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

export enum CursorType {
  CreatedAt = 'createdAt',
  DueDate = 'dueDate'
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
  description?: Maybe<ItemDescription>;
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
  viewCount?: Maybe<Scalars['Int']>;
};

export type ItemAddInput = {
  aCondition: Scalars['Int'];
  buyNow?: InputMaybe<Scalars['Int']>;
  categoryId: Scalars['Int'];
  deliveryType: Scalars['Int'];
  dueDate: Scalars['String'];
  name: Scalars['String'];
  sCondition: Scalars['Int'];
  sPrice: Scalars['Int'];
  status?: InputMaybe<Scalars['Int']>;
  title: Scalars['String'];
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

export type ItemImageUpdateInput = {
  image?: InputMaybe<Scalars['String']>;
  itemImageId?: InputMaybe<Scalars['Int']>;
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

export type ItemUpdateInput = {
  aCondition?: InputMaybe<Scalars['Int']>;
  buyNow?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  deliveryType?: InputMaybe<Scalars['Int']>;
  dueDate?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  sCondition?: InputMaybe<Scalars['Int']>;
  sPrice?: InputMaybe<Scalars['Int']>;
  status?: InputMaybe<Scalars['Int']>;
  title?: InputMaybe<Scalars['String']>;
};

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
  id: Scalars['Long'];
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
  addItem?: Maybe<Item>;
  addUser?: Maybe<User>;
  bid?: Maybe<Bidding>;
  updateItem?: Maybe<Item>;
  updateItemImage?: Maybe<Item>;
  updatePushToken?: Maybe<Scalars['Boolean']>;
  updateUser?: Maybe<User>;
};


export type MutationAddItemArgs = {
  description?: InputMaybe<Scalars['String']>;
  images?: InputMaybe<Array<InputMaybe<Scalars['String']>>>;
  itemAdd?: InputMaybe<ItemAddInput>;
};


export type MutationBidArgs = {
  bid?: InputMaybe<BidInput>;
};


export type MutationUpdateItemArgs = {
  description?: InputMaybe<Scalars['String']>;
  itemId?: InputMaybe<Scalars['Int']>;
  itemUpdate?: InputMaybe<ItemUpdateInput>;
};


export type MutationUpdateItemImageArgs = {
  itemId?: InputMaybe<Scalars['Int']>;
  itemImageUpdate?: InputMaybe<ItemImageUpdateInput>;
};


export type MutationUpdatePushTokenArgs = {
  pushTokenUpdate?: InputMaybe<PushTokenUpdateInput>;
};


export type MutationUpdateUserArgs = {
  userUpdate?: InputMaybe<UserUpdateInput>;
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
  getBidding?: Maybe<Array<Maybe<Bidding>>>;
  getCategory?: Maybe<Category>;
  getCategoryList?: Maybe<CategoryConnection>;
  getEndingSoonItems?: Maybe<Array<Maybe<Item>>>;
  getItem?: Maybe<Item>;
  getItemList?: Maybe<ItemConnection>;
  getMyBidding?: Maybe<Array<Maybe<Bidding>>>;
  getUser?: Maybe<User>;
  me?: Maybe<User>;
  scanCategory?: Maybe<Array<Maybe<Category>>>;
};


export type QueryGetBiddingArgs = {
  biddingQuery?: InputMaybe<BiddingQueryInput>;
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


export type QueryGetEndingSoonItemsArgs = {
  count?: InputMaybe<Scalars['Int']>;
  itemQuery?: InputMaybe<ItemQueryInput>;
  keyword?: InputMaybe<Scalars['String']>;
};


export type QueryGetItemArgs = {
  id: Scalars['Int'];
};


export type QueryGetItemListArgs = {
  after?: InputMaybe<Scalars['String']>;
  before?: InputMaybe<Scalars['String']>;
  cursorType?: InputMaybe<CursorType>;
  first?: InputMaybe<Scalars['Int']>;
  itemQuery?: InputMaybe<ItemQueryInput>;
  keyword?: InputMaybe<Scalars['String']>;
  last?: InputMaybe<Scalars['Int']>;
};


export type QueryGetMyBiddingArgs = {
  biddingQuery?: InputMaybe<BiddingQueryInput>;
};


export type QueryGetUserArgs = {
  id: Scalars['Int'];
};

export type SuccessfulBid = {
  __typename?: 'SuccessfulBid';
  biddingId: Scalars['Int'];
  createdAt: Scalars['String'];
  id: Scalars['Int'];
  item?: Maybe<Item>;
  itemId: Scalars['Int'];
  status: Scalars['Int'];
  user?: Maybe<User>;
  userId: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  birth?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  gender?: Maybe<Gender>;
  id: Scalars['Int'];
  items?: Maybe<ItemConnection>;
  joinPath?: Maybe<JoinPath>;
  kakaoAccount?: Maybe<KakaoAccount>;
  nickname?: Maybe<Scalars['String']>;
  passwd?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  status: Scalars['Int'];
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

export type PushTokenUpdateInput = {
  status?: InputMaybe<Scalars['Int']>;
  token?: InputMaybe<Scalars['String']>;
};

export type UserUpdateInput = {
  birth?: InputMaybe<Scalars['String']>;
  deletedAt?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  gender?: InputMaybe<Gender>;
  nickname?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['Int']>;
};
