import {Filter} from '@loopback/repository';
import {
  createStubInstance,
  expect,
  sinon,
  StubbedInstanceWithSinonAccessor,
} from '@loopback/testlab';
import {UserController} from '../../../controllers';
import {User} from '../../../models/index';
import {UserRepository} from '../../../repositories';
import {Geocoder} from '../../../services';
import {aLocation, givenUser} from '../../helpers';

describe('UserController', () => {
  let userRepo: StubbedInstanceWithSinonAccessor<UserRepository>;
  let geoService: Geocoder;

  let geocode: sinon.SinonStub;

  /*
  =============================================================================
  TEST VARIABLES
  Combining top-level objects with our resetRepositories method means we don't
  need to duplicate several variable assignments (and generation statements)
  in all of our test logic.

  NOTE: If you wanted to parallelize your test runs, you should avoid this
  pattern since each of these tests is sharing references.
  =============================================================================
  */
  let controller: UserController;
  let aUser: User;
  let aUserWithId: User;
  let aChangedUser: User;
  let aListOfUsers: User[];

  beforeEach(resetRepositories);

  describe('createUser', () => {
    it('creates a User', async () => {
      const create = userRepo.stubs.create;
      create.resolves(aUserWithId);
      const result = await controller.signup(aUser);
      expect(result).to.eql(aUserWithId);
      sinon.assert.calledWith(create, aUser);
    });

    // it('resolves remindAtAddress to a geocode', async () => {
    //   const create = userRepo.stubs.create;
    //   geocode.resolves([aLocation.geopoint]);
    //
    //   const input = givenUser({geoLocation: aLocation.address});
    //
    //   const expected = new User(input);
    //   Object.assign(expected, {
    //     remindAtAddress: aLocation.address,
    //     remindAtGeo: aLocation.geostring,
    //   });
    //   create.resolves(expected);
    //
    //   const result = await controller.create(input);
    //
    //   expect(result).to.eql(expected);
    //   sinon.assert.calledWith(create, input);
    //   sinon.assert.calledWith(geocode, input.geoLocation);
    // });
  });

  // describe('findUserById', () => {
  //   it('returns a user if it exists', async () => {
  //     const findById = userRepo.stubs.findById;
  //     findById.resolves(aUserWithId);
  //     expect(await controller.findById(aUserWithId.id as number)).to.eql(
  //       aUserWithId,
  //     );
  //     sinon.assert.calledWith(findById, aUserWithId.id);
  //   });
  // });
  //
  // describe('findUsers', () => {
  //   it('returns multiple users if they exist', async () => {
  //     const find = userRepo.stubs.find;
  //     find.resolves(aListOfUsers);
  //     expect(await controller.find()).to.eql(aListOfUsers);
  //     sinon.assert.called(find);
  //   });
  //
  //   it('returns empty list if no users exist', async () => {
  //     const find = userRepo.stubs.find;
  //     const expected: User[] = [];
  //     find.resolves(expected);
  //     expect(await controller.find()).to.eql(expected);
  //     sinon.assert.called(find);
  //   });
  //
  //   it('uses the provided filter', async () => {
  //     const find = userRepo.stubs.find;
  //     const filter: Filter<User> = {where: {username: "vjekooo"}};
  //
  //     find.resolves(aListOfUsers);
  //     await controller.find(filter);
  //     sinon.assert.calledWith(find, filter);
  //   });
  // });

  describe('replaceUser', () => {
    it('successfully replaces existing items', async () => {
      const replaceById = userRepo.stubs.replaceById;
      replaceById.resolves();
      await controller.replaceById(aUserWithId.id as string, aChangedUser);
      sinon.assert.calledWith(replaceById, aUserWithId.id, aChangedUser);
    });
  });

  describe('updateUser', () => {
    it('successfully updates existing items', async () => {
      const updateById = userRepo.stubs.updateById;
      updateById.resolves();
      await controller.updateById(aUserWithId.id as string, aChangedUser);
      sinon.assert.calledWith(updateById, aUserWithId.id, aChangedUser);
    });
  });

  describe('deleteUser', () => {
    it('successfully deletes existing items', async () => {
      const deleteById = userRepo.stubs.deleteById;
      deleteById.resolves();
      await controller.deleteById(aUserWithId.id as string);
      sinon.assert.calledWith(deleteById, aUserWithId.id);
    });
  });

  function resetRepositories() {
    userRepo = createStubInstance(UserRepository);
    aUser = givenUser();
    aUserWithId = givenUser({
      id: "1",
    });
    aListOfUsers = [
      aUserWithId,
      givenUser({
        id: "2",
        username: 'vjekooo',
      }),
    ] as User[];
    aChangedUser = givenUser({
      id: aUserWithId.id,
      username: 'testy',
    });

    // geoService = {geocode: sinon.stub()};
    // geocode = geoService.geocode as sinon.SinonStub;
    //
    // controller = new UserController(userRepo, geoService);
  }
});
