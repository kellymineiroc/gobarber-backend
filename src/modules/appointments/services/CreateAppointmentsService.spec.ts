import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;
let fakeNotificationsRepository: FakeNotificationsRepository;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    fakeNotificationsRepository = new FakeNotificationsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository, fakeNotificationsRepository);
  });

  it('should be able to create a new appoitnment', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    const appoitnment = await createAppointment.execute({
      date: new Date(2020, 7, 10, 13),
      provider_id: '123123',
      user_id: '123456',
    });

    expect(appoitnment).toHaveProperty('id');
    expect(appoitnment.provider_id).toBe('123123');
  });

  it('should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 7, 10, 15);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '123456',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
      user_id: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 7, 10, 11),
      provider_id: '123123',
      user_id: '123456',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 7, 10, 13),
      provider_id: '123123',
      user_id: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 7, 10, 12).getTime();
    });

    await expect(createAppointment.execute({
      date: new Date(2020, 7, 11, 7),
      provider_id: '123456',
      user_id: '123123',
    })).rejects.toBeInstanceOf(AppError);

    await expect(createAppointment.execute({
      date: new Date(2020, 7, 11, 18),
      provider_id: '123456',
      user_id: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });
});
