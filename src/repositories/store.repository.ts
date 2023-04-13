import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Store,  StoreRelations} from '../models';

export class StoreRepository extends DefaultCrudRepository<
  Store,
  typeof Store.prototype.id,
  StoreRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Store, dataSource);
  }
}