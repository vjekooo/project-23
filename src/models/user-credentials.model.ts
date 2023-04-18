import { belongsTo, Entity, model, property } from '@loopback/repository';
import { User, UserWithRelations } from './user.model';

@model()
export class UserCredentials extends Entity {
	@property({
		type: 'string',
		id: true
	})
	id: string;

	@property({
		type: 'string',
		required: true,
		hidden: true
	})
	password: string;

	@belongsTo(() => User)
	userId?: string;

	constructor(data?: Partial<UserCredentials>) {
		super(data);
	}
}

export interface UserCredentialsRelations {
	user: UserWithRelations;
}

export type UserCredentialsWithRelations = UserCredentials & UserCredentialsRelations;
