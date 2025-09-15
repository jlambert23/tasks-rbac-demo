import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { AppDataSource } from "./data-source";

async function bootstrap() {
  // Initialize database first
  await AppDataSource.initialize();
  console.log("Database initialized");

  // Create NestJS app
  const app = await NestFactory.create(AppModule);

  await app.listen(3000);
  console.log("Application is running on: http://localhost:3000");
}

bootstrap().catch((error) => console.log(error));
