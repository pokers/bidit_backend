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

export type Alarm = {
  __typename?: 'Alarm';
  content?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  title?: Maybe<Scalars['String']>;
  type?: Maybe<AlarmType>;
  updatedAt?: Maybe<Scalars['String']>;
};

export enum AlarmType {
  Chat = 'CHAT',
  Endingsoon = 'ENDINGSOON',
  Endtime = 'ENDTIME',
  Event = 'EVENT',
  Higherbidder = 'HIGHERBIDDER',
  Master = 'MASTER',
  Successfulbid = 'SUCCESSFULBID'
}

export type AppleAccount = {
  __typename?: 'AppleAccount';
  createdAt?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  email_verified?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  is_private_email?: Maybe<Scalars['Boolean']>;
  real_user_status?: Maybe<Scalars['Int']>;
  status: Scalars['Int'];
  sub?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  userId: Scalars['Int'];
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
  detail?: Maybe<ItemDetail>;
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
  detail?: InputMaybe<ItemDetailInput>;
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

export type ItemDetail = {
  __typename?: 'ItemDetail';
  battery?: Maybe<Scalars['String']>;
  cam?: Maybe<Scalars['String']>;
  categoryId?: Maybe<Scalars['Int']>;
  cpu?: Maybe<Scalars['String']>;
  createdAt?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['String']>;
  flash?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  itemId?: Maybe<Scalars['Int']>;
  lens?: Maybe<Scalars['String']>;
  networkType?: Maybe<Scalars['String']>;
  period?: Maybe<Scalars['Int']>;
  ram?: Maybe<Scalars['String']>;
  resolution?: Maybe<Scalars['String']>;
  size?: Maybe<Scalars['String']>;
  status?: Maybe<Scalars['Int']>;
  type?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  vendor?: Maybe<Scalars['String']>;
  warranty?: Maybe<Scalars['String']>;
  weight?: Maybe<Scalars['String']>;
  wire?: Maybe<Scalars['String']>;
};

export type ItemDetailInput = {
  battery?: InputMaybe<Scalars['String']>;
  cam?: InputMaybe<Scalars['String']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  cpu?: InputMaybe<Scalars['String']>;
  flash?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['Int']>;
  lens?: InputMaybe<Scalars['String']>;
  networkType?: InputMaybe<Scalars['String']>;
  period?: InputMaybe<Scalars['Int']>;
  ram?: InputMaybe<Scalars['String']>;
  resolution?: InputMaybe<Scalars['String']>;
  size?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<Scalars['Int']>;
  type?: InputMaybe<Scalars['String']>;
  vendor?: InputMaybe<Scalars['String']>;
  warranty?: InputMaybe<Scalars['String']>;
  weight?: InputMaybe<Scalars['String']>;
  wire?: InputMaybe<Scalars['String']>;
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
  End = 'END',
  Ongoing = 'ONGOING',
  Registed = 'REGISTED',
  Sold = 'SOLD'
}

export type ItemUpdateInput = {
  aCondition?: InputMaybe<Scalars['Int']>;
  buyNow?: InputMaybe<Scalars['Int']>;
  categoryId?: InputMaybe<Scalars['Int']>;
  deliveryType?: InputMaybe<Scalars['Int']>;
  detail?: InputMaybe<ItemDetailInput>;
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
  addUserAlarm?: Maybe<Scalars['Boolean']>;
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


export type MutationAddUserAlarmArgs = {
  status?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['Int']>;
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

export type Penalty = {
  __typename?: 'Penalty';
  createdAt: Scalars['String'];
  deletedAt?: Maybe<Scalars['String']>;
  description?: Maybe<Scalars['String']>;
  dueDate?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  status: Scalars['Int'];
  type?: Maybe<PenaltyType>;
  updatedAt?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
};

export enum PenaltyType {
  Bidding = 'BIDDING',
  Kicked = 'KICKED',
  Selling = 'SELLING'
}

export type PushToken = {
  __typename?: 'PushToken';
  createdAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  token?: Maybe<Scalars['String']>;
  updatedAt?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
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
  appleAccount?: Maybe<AppleAccount>;
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
  penalty?: Maybe<Penalty>;
  phone?: Maybe<Scalars['String']>;
  pushToken?: Maybe<PushToken>;
  status: Scalars['Int'];
  updatedAt?: Maybe<Scalars['String']>;
  userAlarm?: Maybe<UserAlarm>;
};

export type UserAlarm = {
  __typename?: 'UserAlarm';
  alarmId?: Maybe<Scalars['Int']>;
  createdAt?: Maybe<Scalars['String']>;
  deletedAt?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Int']>;
  status?: Maybe<Scalars['Int']>;
  updatedAt?: Maybe<Scalars['String']>;
  userId?: Maybe<Scalars['Int']>;
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
