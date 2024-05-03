import packageJson from '../package.json';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = app.get(ConfigService);
  const port: number =
    Number.parseInt(process.env.PORT) || config.get<number>('PORT') || 3000;

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  const configSwagger = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth()
    .setContact(
      packageJson.author.name,
      packageJson.author.url,
      packageJson.author.email,
    );

  const document = SwaggerModule.createDocument(app, configSwagger.build());
  SwaggerModule.setup('api', app, document);
  await app.listen(port, () => {
    new Logger('NestApplication').log(
      `${packageJson.name} is listening on port ${port}`,
    );
  });
}
bootstrap();
