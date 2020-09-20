import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakerHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

describe('CreateUser', () => {
  it('should be able to create a new user', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUserService = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    const user = await createUserService.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    })

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create a new user with same email from another', async () => {
    const fakeUsersRepository = new FakeUsersRepository();
    const fakeHashProvider = new FakeHashProvider();

    const createUser = new CreateUserService(fakeUsersRepository, fakeHashProvider);

    await createUser.execute({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    })

    await expect(createUser.execute({
      name: 'Julia',
      email: 'john.doe@gmail.com',
      password: 'abc123',
    })).rejects.toBeInstanceOf(AppError);
  })
});