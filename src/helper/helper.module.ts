import { Module } from '@nestjs/common';
import { HelperService } from './helper.service';
import { MailerService } from './mailer.service';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';

@Module({
  imports: [ConfigModule],
  providers: [
    HelperService,
    MailerService,
    CloudinaryService,
    ...[CloudinaryProvider], 
  ],
  exports: [HelperService, MailerService, CloudinaryService],
})
export class HelperModule {}
