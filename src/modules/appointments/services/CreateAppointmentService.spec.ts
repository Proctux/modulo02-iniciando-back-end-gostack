import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    
    createAppointment = new CreateAppointmentService(
      fakeAppointmentsRepository,
      fakeNotificationsRepository
    );
  })

  it('should be able to create a new appointment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 12),
      user_id: '123123',
      provider_id: '1231234',
    })

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('1231234');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const date = () => { jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 7, 10).getTime()
    })};

    date();

    await createAppointment.execute({
      date: new Date(2020, 4, 7, 11),
      user_id: '123123',
      provider_id: '1231234'
    });

    date();

    await expect(createAppointment.execute({
      date: new Date(2020, 4, 7, 11),
      user_id: '123123',
      provider_id: '1231234',
    })).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to create an appointment on a past date", async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
        createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user',
        provider_id: 'provider'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 11).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 12),
        provider_id: '123',
        user_id: '123'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 8, 10).getTime()
    });

    await expect(
        createAppointment.execute({
        date: new Date(2020, 4, 10, 7),
        provider_id: 'provider-id',
        user_id: 'user-id'
      })
    ).rejects.toBeInstanceOf(AppError);

    await expect(
        createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        provider_id: 'provider-id',
        user_id: 'user-id'
      })
    ).rejects.toBeInstanceOf(AppError)
  });
});