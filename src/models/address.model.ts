import { belongsTo, Entity, model, property } from '@loopback/repository';
import { uuid } from 'uuidv4';
import { User, UserWithRelations } from './user.model';

@model()
export class Address extends Entity {
	@property({
		type: 'string',
		id: true,
		useDefaultIdType: false,
		default: () => uuid(),
		postgresql: {
			dataType: 'uuid'
		}
	})
	id?: number;

	@property({
		type: 'string',
		required: true
	})
	street: string;

	// @property({
	//   type: 'any',
	// })
	// geoLocation?: any;

	@belongsTo(() => User)
	userId: string;

	constructor(data?: Partial<Address>) {
		super(data);
	}
}

export interface AddressRelations {
	user: UserWithRelations;
}

export type AddressWithRelations = Address & AddressRelations;
