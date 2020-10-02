import { inject, injectable } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import User from '../infra/typeorm/entities/Users'
import AppError from '@shared/errors/AppError';

interface IRequest {
  user_id: string;
  name: string;
  email: string;
  old_password?: string;
  password?: string
}

@injectable()
class UpdateProfile {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider
  ){}

  public async execute({ user_id, name, email, password, old_password }: IRequest): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError("Não foi possível atualizar o usuário")
    }

    const userWithUpdatedEmail = await this.usersRepository.findByEmail(email)

    if(userWithUpdatedEmail && userWithUpdatedEmail.id !== user_id) {
      throw new AppError("Não foi possível atualizar o usuário. Novo email informado já registrado.")
    }

    user.name = name
    user.email = email

    if(password && !old_password) {
      throw new AppError("É necessário informar a senha atual para modificar a senha")
    };


    if (password && old_password) {
      const checkOldPassword = await this.hashProvider.compareHash(
        old_password, user.password
      );

      if (!checkOldPassword) {
        throw new AppError("A senha antiga informada está incorreta. Favor repetir a operação")
      };

      user.password = await this.hashProvider.generateHash(password);
    };

    return this.usersRepository.save(user);
  }
}

export default UpdateProfile;