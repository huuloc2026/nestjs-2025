import { Module } from '@nestjs/common';
import { MailerService } from './mailer.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';

@Module({
  imports: [
    MailerModule.forRoot({
      
      transport: {
        host: 'smtp.example.com',
        secure: false,
        auth: {
          user: 'user@example.com',
          pass: 'topsecret',
        },
      },
      defaults: {
        from: '"No Reply" <noreply@example.com>',
      },
      template: {
       
      },
    }),
  ],
  providers: [MailerService],
  exports: [MailerService],
})
export class MailModule {}
