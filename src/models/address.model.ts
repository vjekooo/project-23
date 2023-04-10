import {Entity, model, property} from '@loopback/repository';
import { uuid } from 'uuidv4';

@model()
export class Address extends Entity {
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
  street: string;

  // @property({
  //   type: 'any',
  // })
  // geoLocation?: any;

  constructor(data?: Partial<Address>) {
    super(data);
  }
}

export interface AddressRelations {
  // describe navigational properties here
}

export type UserWithRelations = Address & AddressRelations;
