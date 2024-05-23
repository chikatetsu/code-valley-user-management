import packageJson from '../package.json';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe, ValidationPipeOptions } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { configureSwagger } from '@infra/config/swagger.config';

async function bootstrap() {
  const logger = new Logger('NestApplication');

  const app = await NestFactory.create(AppModule);
  const configService: ConfigService = app.get(ConfigService);
  const port =
    Number.parseInt(process.env.PORT) ||
    configService.get<number>('PORT') ||
    3000;

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  });

  const validationOptions: ValidationPipeOptions = {
    whitelist: true,
    transform: true,
  };
  app.useGlobalPipes(new ValidationPipe(validationOptions));

  configureSwagger(app);

  await app.listen(port, () => {
    logger.log(`${packageJson.name} is listening on port ${port}`);
    logger.log(`Swagger is available on http://localhost:${port}/api`);
  });
}
bootstrap();
