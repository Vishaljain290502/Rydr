// cloudinary.module.ts
import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinaruy-services';

@Module({
  providers: [CloudinaryService],
  exports: [CloudinaryService], // Ensure it's exported so other modules can use it
})
export class CloudinaryModule {}
