import {Entity, model, property} from '@loopback/repository';
import { uuid } from 'uuidv4';

@model()
export class User extends Entity {
  @property({
    type: 'number',
    id: true,
    useDefaultIdType: false,
    default: () => uuid(),
    postgresql: {
      dataType: 'uuid',
    },
  })
  id?: number;

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

  // @property({
  //   type: 'any',
  // })
  // geoLocation?: any;

  constructor(data?: Partial<User>) {
    super(data);
  }
}

export interface UserRelations {
  // describe navigational properties here
}

export type UserWithRelations = User & UserRelations;
