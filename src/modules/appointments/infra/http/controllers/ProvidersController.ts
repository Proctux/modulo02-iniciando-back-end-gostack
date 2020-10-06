import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

export default class ProvidersController {
  public async index(request: Request, response: Response) {
    const user_id = request.user.id;

    const listProviders = container.resolve(ListProvidersService);

    const users = await listProviders.execute({ user_id });

    users.forEach(user => delete user.password)

    return response.json(users);
  }
}