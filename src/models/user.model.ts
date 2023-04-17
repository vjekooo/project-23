import {Entity, hasMany, hasOne, model, property} from '@loopback/repository';
import { uuid } from 'uuidv4';
import {Store, StoreWithRelations} from "./store.model";
import {Address, AddressWithRelations} from "./address.model";
import {UserCredentials} from "./user-credentials.model";

@model()
export class User extends Entity {
  @property({
    type: 'string',
    id: true,
    useDefaultIdType: false,
    default: () => uuid(),
    postgresql: {
      dataType: 'uuid',
    },
  })
  id: string;

  @property({
    type: 'string',
    required: true,
    index: {
      unique: true
    }
  })
  email: string;

  @property({
    type: 'string',
    index: {
      unique: true
    }
  })
  username?: string;

  @property({
    type: 'string',
  })
  firstName?: string;

  @property({
    type: 'string',
  })
  lastName?: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  created?: string;

  @property({
    type: 'boolean',
    default: () => false
  })
  isConfirmed?: string;

  @hasOne(() => Address, {keyTo: 'userid'})
  address?: Address;

  @hasMany(() => Store, {keyTo: 'userid'})
  stores?: Store[];

  @hasOne(() => UserCredentials)
  credentials?: UserCredentials;

  // @property({
  //   type: 'any',
  // })
  // geoLocation?: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  address?: AddressWithRelations;
  stores?: StoreWithRelations[];
  credentials?: UserCredentials;
}

export type UserWithRelations = User & UserRelations;
