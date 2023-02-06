import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { environment } from '../environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => environment]
    })
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
