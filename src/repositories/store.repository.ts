import {Getter, inject} from '@loopback/core';
import {
  BelongsToAccessor,
  DefaultCrudRepository,
  repository,
} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Store, User, StoreRelations} from '../models';
import {UserRepository} from './user.repository';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id,
  StoreRelations
> {
  public readonly user: BelongsToAccessor<
    User,
    typeof Store.prototype.id
  >;

  constructor(
    @inject('datasources.db') dataSource: DbDataSource,
    @repository.getter('UserRepository')
    protected userRepositoryGetter: Getter<UserRepository>,
  ) {
    super(Store, dataSource);

    this.user = this.createBelongsToAccessorFor(
      'user',
      userRepositoryGetter,
    );
    this.registerInclusionResolver('user', this.user.inclusionResolver);
  }
}