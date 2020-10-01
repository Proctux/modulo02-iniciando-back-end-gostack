import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

interface IMessage {
  to: string;
  body: string;
}

export default class FakeMailProvider implements IMailProvider {
  private message: ISendMailDTO[] = []

  public async sendMail(message: ISendMailDTO): Promise<void> {
    this.message.push(message);
  }
}