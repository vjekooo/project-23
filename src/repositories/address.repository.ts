import { Getter, inject } from '@loopback/core';

import { BelongsToAccessor, DefaultCrudRepository, repository } from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Address, User, AddressRelations } from '../models';
import { UserRepository } from './user.repository';

export class AddressRepository extends DefaultCrudRepository<
	Address,
	typeof Address.prototype.id,
	AddressRelations
> {
	public readonly user: BelongsToAccessor<User, typeof Address.prototype.id>;

	constructor(
		@inject('datasources.db') dataSource: DbDataSource,
		@repository.getter('UserRepository')
		protected userRepositoryGetter: Getter<UserRepository>
	) {
		super(Address, dataSource);

		this.user = this.createBelongsToAccessorFor('user', userRepositoryGetter);
		this.registerInclusionResolver('user', this.user.inclusionResolver);
	}
}
