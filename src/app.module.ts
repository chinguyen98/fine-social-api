import { Module } from '@nestjs/common';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { ConfigModule } from '@nestjs/config';
import { MailerModule } from '@nestjs-modules/mailer';
import { TypegooseModule } from "nestjs-typegoose";

import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { VerifyModule } from './verify/verify.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    MailerModule.forRoot({
      transport: {
        host: process.env.MAIL_HOST,
        port: process.env.MAIL_PORT,
        ignoreTLS: false,
        secure: false,
        auth: {
          user: process.env.MAIL_USERNAME,
          pass: process.env.MAIL_PASSWORD,
        }
      },
      defaults: {
        from: process.env.MAIL_USERNAME,
      },
      preview: false,
      template: {
        dir: process.cwd() + '/src/mail/templates/',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        }
      }
    }),

    TypegooseModule.forRoot(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    }),

    AuthModule,
    MailModule,
    VerifyModule
  ],
})
export class AppModule {
}
