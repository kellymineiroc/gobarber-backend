import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '../repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from './CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {
  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    createAppointment = new CreateAppointmentService(fakeAppointmentsRepository);
  });

  it('should be able to create a new appoitnment', async () => {
    const appoitnment = await createAppointment.execute({
      date: new Date(),
      provider_id: '123123',
    });

    expect(appoitnment).toHaveProperty('id');
    expect(appoitnment.provider_id).toBe('123123');
  });

  it('should not be able to create two appoitnments on the same time', async () => {
    const appointmentDate = new Date(10, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
    });

    await expect(createAppointment.execute({
      date: appointmentDate,
      provider_id: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });
});
