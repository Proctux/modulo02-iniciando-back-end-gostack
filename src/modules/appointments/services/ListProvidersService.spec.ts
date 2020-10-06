import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from './ListProvidersService';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';

let fakeUsersRepository: IUsersRepository
let listProviders: ListProvidersService

describe('ListProviders', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();

    listProviders = new ListProvidersService(fakeUsersRepository)
  });

  it('should be able to show the providers', async() => {
    const user1 = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    const user2 = await fakeUsersRepository.create({
      name: 'John Tre',
      email: 'john.tre@gmail.com',
      password: '123123'
    });

    const loggedUser = await fakeUsersRepository.create({
      name: 'John Qua',
      email: 'john.qua@gmail.com',
      password: '123123'
    });

    const providers = await listProviders.execute({
      user_id: loggedUser.id
    });

    expect(providers).toEqual([user1, user2])
  })
})