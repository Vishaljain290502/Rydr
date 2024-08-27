import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { HelperModule } from './helper/helper.module';

import { TripModule } from './trip/ride.module';

@Module({
  imports: [UserModule, TripModule, AuthModule,MongooseModule.forRoot('mongodb+srv://vishaljaurasoft:uWkjdnz06DQ2zDKg@cluster0.lcqe8e7.mongodb.net/rydr?retryWrites=true&w=majority&appName=Cluster0'), HelperModule, TripModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(AuthMiddleware)
  //     .exclude(
  //       { path: 'auth/login', method: RequestMethod.POST },
  //       { path: 'auth/register', method: RequestMethod.POST },
  //       { path: 'auth/forgot-password', method: RequestMethod.POST },
  //       { path: 'auth/reset-password', method: RequestMethod.POST },
  //       { path: 'auth/verify-phone', method: RequestMethod.POST },
  //       { path: 'auth/verify-email', method: RequestMethod.POST }
  //     )
  //     .forRoutes('*');
  // }
}






