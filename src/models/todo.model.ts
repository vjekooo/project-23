import {Entity, model, property} from '@loopback/repository';

@model()
export class Todo extends Entity {
  @property({
    type: 'number',
    id: true,
    generated: false,
  })
  id?: number;

  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
  })
  desc?: string;

  @property({
    type: 'boolean',
  })
  isComplete?: boolean;

  @property({
    type: 'string',
  })
  remindAtAddress?: string; // address,city,zipcode

  // TODO(bajtos) Use LoopBack's GeoPoint type here
  @property({
    type: 'string',
  })
  remindAtGeo?: string; // latitude,longitude

  @property({
    type: 'any',
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  tag?: any;

  constructor(data?: Partial<Todo>) {
    super(data);
  }
}

export interface TodoRelations {
  // describe navigational properties here
}

export type TodoWithRelations = Todo & TodoRelations;
