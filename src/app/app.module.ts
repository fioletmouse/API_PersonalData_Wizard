import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WizardModule } from 'src/wizard/wizard.module';
import { environment } from '../environment';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => environment]
    }),
    WizardModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
