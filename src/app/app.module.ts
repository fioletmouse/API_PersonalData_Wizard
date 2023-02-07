import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WizardModule } from 'src/wizard/wizard.module';
import { environment } from '../environment';
import { WSession } from './../db_entities/session.entity';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [() => environment]
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('pgCredentials')
      }),
      inject: [ConfigService]
    }),
    TypeOrmModule.forFeature([WSession]),
    WizardModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
