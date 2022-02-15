import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppService } from './app.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // const service: AppService = app.select(AppModule).get(AppService);
  const service = app.get(AppService);
  service.addEntities();
  await app.listen(3000);
}
bootstrap();
