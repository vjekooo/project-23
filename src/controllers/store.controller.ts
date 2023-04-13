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

    const userId = "05c28fe7-d7b2-4c32-a87e-71da513278d5"

    const newStore = {...store, userId}

    return this.storeRepository.create(newStore);
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
    @param.path.string('id') id: string,
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
