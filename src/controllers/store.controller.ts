import {
  Filter,
  FilterExcludingWhere,
  repository,
} from '@loopback/repository';
import {
  get,
  getModelSchemaRef,
  HttpErrors, param,
  post,
  requestBody,
} from '@loopback/rest';
import {Store, User} from '../models';
import {StoreRepository} from '../repositories';

export class StoreController {
  constructor(
    @repository(StoreRepository)
    public storeRepository: StoreRepository,
  ) {}

  @post('/stores', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {'application/json': {schema: getModelSchemaRef(Store)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Store, {
            exclude: ['id'],
          }),
        },
      },
    })
      store: Omit<Store, 'id'>,
  ): Promise<Store> {

    return this.storeRepository.create(store);
  }
  @get('/stores/{id}', {
    responses: {
      '200': {
        description: 'Store model instance',
        content: {'application/json': {schema: getModelSchemaRef(Store)}},
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Store, {exclude: 'where'}) filter?: FilterExcludingWhere<Store>,
  ): Promise<Store> {
    return this.storeRepository.findById(id, filter);
  }

  @get('/stores', {
    responses: {
      '200': {
        description: 'Array of Store model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Store, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(@param.filter(Store) filter?: Filter<Store>): Promise<Store[]> {
    return this.storeRepository.find(filter);
  }
}
