import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import { AppModule } from './app/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  const swaggerVariablesConfig = configService.get('swagger');
  const config = new DocumentBuilder()
    .setTitle(swaggerVariablesConfig.title)
    .setDescription(swaggerVariablesConfig.description)
    .setVersion(swaggerVariablesConfig.version)
    .build();

  const globalPrefix = 'wizard';
  app.use(helmet());
  app.enableCors({
    origin: new RegExp(configService.get('corsRegex'))
  });
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe());

  const port = configService.get('port') || 4030;

  const document = SwaggerModule.createDocument(app, config);
  const swaggerPath = swaggerVariablesConfig.path;
  SwaggerModule.setup(swaggerPath, app, document);

  await app.listen(port);
}
bootstrap();
