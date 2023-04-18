import { inject } from '@loopback/core';
import { DefaultCrudRepository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { UserCredentials } from '../models';

export class UserCredentialsRepository extends DefaultCrudRepository<
	UserCredentials,
	typeof UserCredentials.prototype.id,
	UserCredentials
> {
	constructor(@inject('datasources.db') dataSource: DbDataSource) {
		super(UserCredentials, dataSource);
	}
}
