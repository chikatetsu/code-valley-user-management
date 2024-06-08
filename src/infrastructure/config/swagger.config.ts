import packageJson from '@/package.json';
import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { configService } from './config.service';

export function configureSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle(packageJson.name)
    .setDescription(packageJson.description)
    .setVersion(packageJson.version)
    .addBearerAuth()
    .setContact(
      packageJson.author.name,
      packageJson.author.url,
      packageJson.author.email,
    )
    .addServer(configService.getAppHostname())
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document, {
    jsonDocumentUrl: 'api-docs',
  });
}
