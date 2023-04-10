import {EntityNotFoundError} from '@loopback/repository';
import {Request, Response, RestBindings} from '@loopback/rest';
import {
  Client,
  createRestAppClient,
  expect,
  givenHttpServerConfig,
  toJSON,
} from '@loopback/testlab';
import morgan from 'morgan';
import {MainApplication} from '../../application';
import {User} from '../../models/';
import {UserRepository} from '../../repositories/';
import {Geocoder} from '../../services';
import {
  aLocation,
  getProxiedGeoCoderConfig,
  givenCachingProxy,
  givenUser,
  HttpCachingProxy,
  isGeoCoderServiceAvailable,
} from '../helpers';

describe('UserApplication', () => {
  let app: MainApplication;
  let client: Client;
  let userRepo: UserRepository;

  let cachingProxy: HttpCachingProxy;
  before(async () => (cachingProxy = await givenCachingProxy()));
  after(() => cachingProxy.stop());

  before(givenRunningApplicationWithCustomConfiguration);
  after(() => app.stop());

  let available = true;

  before(async function (this: Mocha.Context) {
    this.timeout(30 * 1000);
    const service = await app.get<Geocoder>('services.Geocoder');
    available = await isGeoCoderServiceAvailable(service);
  });

  before(givenUserRepository);
  before(() => {
    client = createRestAppClient(app);
  });

  beforeEach(async () => {
    await userRepo.deleteAll();
  });

  it('creates a user', async function (this: Mocha.Context) {
    // Set timeout to 30 seconds as `post /users` triggers geocode look up
    // over the internet and it takes more than 2 seconds
    this.timeout(30000);
    const user = givenUser();
    const response = await client.post('/users').send(user).expect(200);
    expect(response.body).to.containDeep(user);
    const result = await userRepo.findById(response.body.id);
    expect(result).to.containDeep(user);
  });

  it('creates a user with arbitrary property', async function () {
    const user = givenUser({username: "vjekooo"});
    const response = await client.post('/users').send(user).expect(200);
    expect(response.body).to.containDeep(user);
    const result = await userRepo.findById(response.body.id);
    expect(result).to.containDeep(user);
  });

  it('rejects requests to create a user with no title', async () => {
    const user: Partial<User> = givenUser();
    delete user.username;
    await client.post('/users').send(user).expect(422);
  });

  it('rejects requests with input that contains excluded properties', async () => {
    const user = givenUser();
    user.id = 1;
    await client.post('/users').send(user).expect(422);
  });

  // it('creates an address-based reminder', async function (this: Mocha.Context) {
  //   if (!available) return this.skip();
  //   // Increase the timeout to accommodate slow network connections
  //   this.timeout(30000);
  //
  //   const user = givenUser({geoLocation: aLocation.address});
  //   const response = await client.post('/users').send(user).expect(200);
  //   user.geoLocation= aLocation.geostring;
  //
  //   expect(response.body).to.containEql(user);
  //
  //   const result = await userRepo.findById(response.body.id);
  //   expect(result).to.containEql(user);
  // });
  //
  // it('returns 400 if it cannot find an address', async function (this: Mocha.Context) {
  //   if (!available) return this.skip();
  //   // Increase the timeout to accommodate slow network connections
  //   this.timeout(30000);
  //
  //   const user = givenUser({geoLocation: 'this address does not exist'});
  //   const response = await client.post('/users').send(user).expect(400);
  //
  //   expect(response.body.error.message).to.eql(
  //     'Address not found: this address does not exist',
  //   );
  // });

  context('when dealing with a single persisted user', () => {
    let persistedUser: User;

    beforeEach(async () => {
      persistedUser = await givenUserInstance();
    });

    it('gets a user by ID', () => {
      return client
        .get(`/users/${persistedUser.id}`)
        .send()
        .expect(200, toJSON(persistedUser));
    });

    it('returns 404 when getting a user that does not exist', () => {
      return client.get('/users/99999').expect(404);
    });

    it('replaces the user by ID', async () => {
      const updatedUser = givenUser({
        username: "sjhdjsdhsjdh"
      });
      await client
        .put(`/users/${persistedUser.id}`)
        .send(updatedUser)
        .expect(204);
      const result = await userRepo.findById(persistedUser.id);
      expect(result).to.containEql(updatedUser);
    });

    it('returns 404 when replacing a user that does not exist', () => {
      return client.put('/users/99999').send(givenUser()).expect(404);
    });

    it('updates the user by ID ', async () => {
      const updatedUser = givenUser({
        username: "vjekooo",
      });
      await client
        .patch(`/users/${persistedUser.id}`)
        .send(updatedUser)
        .expect(204);
      const result = await userRepo.findById(persistedUser.id);
      expect(result).to.containEql(updatedUser);
    });

    it('returns 404 when updating a user that does not exist', () => {
      return client
        .patch('/users/99999')
        .send(givenUser({username: "vjekooo"}))
        .expect(404);
    });

    it('deletes the user', async () => {
      await client.del(`/users/${persistedUser.id}`).send().expect(204);
      await expect(userRepo.findById(persistedUser.id)).to.be.rejectedWith(
        EntityNotFoundError,
      );
    });

    it('returns 404 when deleting a user that does not exist', async () => {
      await client.del(`/users/99999`).expect(404);
    });

    it('rejects request with invalid keys - constructor.prototype', async () => {
      const res = await client
        .get(
          '/users?filter={"offset":0,"limit":100,"skip":0,' +
            '"where":{"constructor.prototype":{"toString":"def"}},' +
            '"fields":{"title":true,"id":true}}',
        )
        .expect(400);
      expect(res.body?.error).to.containEql({
        statusCode: 400,
        name: 'BadRequestError',
        code: 'INVALID_PARAMETER_VALUE',
        details: {
          syntaxError:
            'JSON string cannot contain "constructor.prototype" key.',
        },
      });
    });

    it('rejects request with invalid keys - __proto__', async () => {
      const res = await client
        .get(
          '/users?filter={"offset":0,"limit":100,"skip":0,' +
            '"where":{"__proto__":{"toString":"def"}},' +
            '"fields":{"title":true,"id":true}}',
        )
        .expect(400);
      expect(res.body?.error).to.containEql({
        statusCode: 400,
        name: 'BadRequestError',
        code: 'INVALID_PARAMETER_VALUE',
        details: {
          syntaxError: 'JSON string cannot contain "__proto__" key.',
        },
      });
    });

    it('rejects request with prohibited keys - badKey', async () => {
      const res = await client
        .get(
          '/users?filter={"offset":0,"limit":100,"skip":0,' +
            '"where":{"badKey":{"toString":"def"}},' +
            '"fields":{"title":true,"id":true}}',
        )
        .expect(400);
      expect(res.body?.error).to.containEql({
        statusCode: 400,
        name: 'BadRequestError',
        code: 'INVALID_PARAMETER_VALUE',
        details: {
          syntaxError: 'JSON string cannot contain "badKey" key.',
        },
      });
    });
  });

  context('allows logging to be reconfigured', () => {
    it('logs http requests', async () => {
      const logs: string[] = [];
      const logToArray = (str: string) => {
        logs.push(str);
      };
      app.configure<morgan.Options<Request, Response>>('middleware.morgan').to({
        stream: {
          write: logToArray,
        },
      });
      await client.get('/users');
      expect(logs.length).to.eql(1);
      expect(logs[0]).to.match(/"GET \/users HTTP\/1\.1" 200 - "-"/);
    });
  });

  it('queries users with a filter', async () => {
    await givenUserInstance({username: 'vjekooo', id: 1});

    const userInProgress = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    await client
      .get('/users')
      .query({filter: {where: {isComplete: false}}})
      .expect(200, [toJSON(userInProgress)]);
  });

  it('exploded filter conditions work', async () => {
    await givenUserInstance({username: 'vjekooo', id: 1});
    await givenUserInstance({username: 'vjekooo', id: 1});

    const response = await client.get('/users').query('filter[limit]=2');
    expect(response.body).to.have.length(2);
  });

  it('queries users with string-based order filter', async () => {
    const userInProgress = await givenUserInstance(
    {username: 'vjekooo', id: 1}
    );

    const userCompleted = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    const userCompleted2 = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    await client
      .get('/users')
      .query({filter: {order: 'title DESC'}})
      .expect(200, toJSON([userCompleted, userCompleted2, userInProgress]));
  });

  it('queries users with array-based order filter', async () => {
    const userInProgress = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    const userCompleted = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    const userCompleted2 = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    await client
      .get('/users')
      .query({filter: {order: ['title DESC']}})
      .expect(200, toJSON([userCompleted, userCompleted2, userInProgress]));
  });

  it('queries users with exploded string-based order filter', async () => {
    const userInProgress = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    const userCompleted = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    const userCompleted2 = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    await client
      .get('/users')
      .query('filter[order]=title%20DESC')
      .expect(200, [
        toJSON(userCompleted),
        toJSON(userCompleted2),
        toJSON(userInProgress),
      ]);
  });

  it('queries users with exploded array-based fields filter', async () => {
    await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });
    await client
      .get('/users')
      .query('filter[fields][0]=title')
      .expect(200, toJSON([{title: 'go to sleep'}]));
  });

  it('queries users with exploded array-based order filter', async () => {
    const userInProgress = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    const userCompleted = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    const userCompleted2 = await givenUserInstance({
      username: 'vjekooo',
      id: 1,
    });

    await client
      .get('/users')
      .query('filter[order][0]=title+DESC')
      .expect(200, toJSON([userCompleted, userCompleted2, userInProgress]));
  });

  /*
   ============================================================================
   TEST HELPERS
   These functions help simplify setup of your test fixtures so that your tests
   can:
   - operate on a "clean" environment each time (a fresh in-memory database)
   - avoid polluting the test with large quantities of setup logic to keep
   them clear and easy to read
   - keep them DRY (who wants to write the same stuff over and over?)
   ============================================================================
   */

  async function givenRunningApplicationWithCustomConfiguration() {
    app = new MainApplication({
      rest: givenHttpServerConfig(),
    });

    app.bind(RestBindings.REQUEST_BODY_PARSER_OPTIONS).to({
      validation: {
        prohibitedKeys: ['badKey'],
      },
    });

    await app.boot();

    /**
     * Override default config for DataSource for testing so we don't write
     * test data to file when using the memory connector.
     */
    app.bind('datasources.config.db').to({
      name: 'db',
      connector: 'memory',
    });

    // Override Geocoder datasource to use a caching proxy to speed up tests.
    app
      .bind('datasources.config.geocoder')
      .to(getProxiedGeoCoderConfig(cachingProxy));

    // Start Application
    await app.start();
  }

  async function givenUserRepository() {
    userRepo = await app.getRepository(UserRepository);
  }

  async function givenUserInstance(user?: Partial<User>) {
    return userRepo.create(givenUser(user));
  }
});
