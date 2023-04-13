import {Entity, model, property} from '@loopback/repository';
import { uuid } from 'uuidv4';

@model()
export class Store extends Entity {
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
  })
  name: string;

  @property({
    type: 'string',
  })
  description: string;

  @property({
    type: 'date',
    default: () => new Date()
  })
  created?: string;

  constructor(data?: Partial<Store>) {
    super(data);
  }
}

export interface StoreRelations {
  // describe navigational properties here
}

export type StoreWithRelations = Store & StoreRelations;
