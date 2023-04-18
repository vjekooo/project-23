import { Getter, inject } from '@loopback/core';
import {
	DefaultCrudRepository,
	HasManyRepositoryFactory,
	HasOneRepositoryFactory,
	repository
} from '@loopback/repository';
import { DbDataSource } from '../datasources';
import { Address, User, UserRelations, Store } from '../models';
import { AddressRepository } from './address.repository';
import { StoreRepository } from './store.repository';

export class UserRepository extends DefaultCrudRepository<
	User,
	typeof User.prototype.id,
	UserRelations
> {
	public readonly stores: HasManyRepositoryFactory<Store, typeof Store.prototype.id>;
	public readonly address: HasOneRepositoryFactory<Address, typeof Address.prototype.id>;

	constructor(
		@inject('datasources.db') dataSource: DbDataSource,
		@repository.getter('AddressRepository')
		protected addressRepositoryGetter: Getter<AddressRepository>,
		@repository.getter('StoreRepository')
		protected storeRepositoryGetter: Getter<StoreRepository>
	) {
		super(User, dataSource);

		this.stores = this.createHasManyRepositoryFactoryFor('stores', storeRepositoryGetter);

		this.registerInclusionResolver('stores', this.stores.inclusionResolver);

		this.address = this.createHasOneRepositoryFactoryFor('address', addressRepositoryGetter);

		this.registerInclusionResolver('address', this.address.inclusionResolver);
	}
}
