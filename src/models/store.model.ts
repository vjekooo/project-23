import { belongsTo, Entity, model, property } from '@loopback/repository';
import { uuid } from 'uuidv4';
import { User, UserWithRelations } from './user.model';

@model()
export class Store extends Entity {
	@property({
		type: 'string',
		id: true,
		useDefaultIdType: false,
		default: () => uuid(),
		postgresql: {
			dataType: 'uuid'
		}
	})
	id?: string;

	@property({
		type: 'string',
		required: true
	})
	name: string;

	@property({
		type: 'string',
		required: true
	})
	description: string;

	@property({
		type: 'date',
		default: () => new Date()
	})
	created?: string;

	@belongsTo(() => User)
	userId: string;

	constructor(data?: Partial<Store>) {
		super(data);
	}
}

export interface StoreRelations {
	user: UserWithRelations;
}

export type StoreWithRelations = Store & StoreRelations;
