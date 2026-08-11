import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { DomainErrorFilter } from './errors/domain-error.filter'

async function bootstrapApp() {
  const app = await NestFactory.create(AppModule)
  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }))
  app.useGlobalFilters(new DomainErrorFilter())
  const port = process.env.PORT ?? 3001
  await app.listen(port)
}
bootstrapApp()
