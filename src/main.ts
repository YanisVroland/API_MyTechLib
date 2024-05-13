import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

// Import the 'process' module to access environment variables
import * as process from 'process';

// Asynchronous function to bootstrap the application
async function bootstrap() {
  // Create an instance of the application using AppModule
  const app = await NestFactory.create(AppModule);

  // Enable Cross-Origin Resource Sharing (CORS) support
  app.enableCors();

  // Listen for incoming requests on the port specified in the STAR_PORT environment variable
  await app.listen(process.env.STAR_PORT);
}

// Call the bootstrap function to start the application
bootstrap();
