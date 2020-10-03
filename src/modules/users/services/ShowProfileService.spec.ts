import usersRouter from '../infra/http/routes/users.routes';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import ShowProfileService from '../services/ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakeUsersRepository: FakeUsersRepository;
let showProfile: ShowProfileService;

describe('ShowProfile', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    showProfile = new ShowProfileService(fakeUsersRepository);
  });
  
  it("should be able to show users profile", async () => {
    const user = await fakeUsersRepository.create({
      name: 'John Doe',
      email: 'john.doe@gmail.com',
      password: '123123'
    });

    const profile = await showProfile.execute({
      user_id: user.id
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('john.doe@gmail.com');
  });

  it("should not be able to show the profile of non-existing user", async () => {
    await expect(
      showProfile.execute({
        user_id: '123'
      }),
    ).rejects.toBeInstanceOf(AppError);
  })
})