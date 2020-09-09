import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import EmailTemplateEnum from 'src/shared/enum/email-template.enum';
import { IRegisterVertificationMailContext } from './mail-context.interface';

@Injectable()
export class MailService {
  constructor(private readonly mailerService: MailerService) { }

  public sendMailToGuest(
    template: EmailTemplateEnum,
    email: string,
    subject: string,
    context: IRegisterVertificationMailContext)
    : void {
    this.mailerService
      .sendMail({
        subject,
        from: 'Fine Social',
        to: email,
        template,
        context: context,
      }).then(success => console.log('Send mail successfully!'))
      .catch(err => console.log(err));
  }
}
