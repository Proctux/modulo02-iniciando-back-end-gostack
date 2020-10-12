import { container } from 'tsyringe';
import mailConfig from '@config/mail';

import IMailProvider from '../MailProvider/models/IMailProvider'


import EtherealMailProvider from '../MailProvider/implementations/EtherealMailProvider';
import SESMailProvider from '../MailProvider/implementations/SESMailProvider';

const providers = {
  ethereal: container.resolve(EtherealMailProvider),
  ses: container.resolve(SESMailProvider)
}

container.registerInstance<IMailProvider>(
  'MailProvider',
  providers[mailConfig.driver]
)