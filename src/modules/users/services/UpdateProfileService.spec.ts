import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakeHashProvider: FakeHashProvider;
let fakeUsersRepository: FakeUsersRepository;
let updateProfile: UpdateProfileService;

describe("UpdateProfile", () => {
  beforeEach(() => {
    fakeHashProvider = new FakeHashProvider();
    fakeUsersRepository = new FakeUsersRepository();

    updateProfile = new UpdateProfileService(fakeUsersRepository, fakeHashProvider)
  });

  it("should be able to update the profile", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'john.tre@gmail.com'
    });

    expect(updatedUser.name).toBe('John Tre');
    expect(updatedUser.email).toBe('john.tre@gmail.com');
  });

  it("should not be able to update the profile of a non-existing user", async () => {
    await expect(
      updateProfile.execute({
        user_id: 'non-existing-user-id',
        name: 'Non-existing-name',
        email: 'Non-existing-email'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to change to another user email", async () => {
    await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    const user = await fakeUsersRepository.create({
      name: 'Test',
      email: 'teste@gmail.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'john.doe@gmail.com'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should be able to update the password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    });

    const updatedUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Tre',
      email: 'john.tre@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updatedUser.password).toBe('123123')
  });

  it("should not be able to update the password without old password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456'
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Tre',
        email: 'john.tre@gmail.com',
        password: '123456'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to update the password with wrong old password", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123456',
    });

    await expect(
      updateProfile.execute({
        user_id: user.id,
        name: 'John Doe',
        email: 'john.doe@gmail.com',
        old_password: '123123',
        password: '123123'
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});