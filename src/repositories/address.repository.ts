import {inject} from '@loopback/core';
import {DefaultCrudRepository} from '@loopback/repository';
import {DbDataSource} from '../datasources';
import {Address, AddressRelations} from '../models';

export class AddressRepositoryRepository extends DefaultCrudRepository<
  Address,
  typeof Address.prototype.id,
  AddressRelations
> {
  constructor(@inject('datasources.db') dataSource: DbDataSource) {
    super(Address, dataSource);
  }
}