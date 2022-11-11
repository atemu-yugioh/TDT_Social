import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    })
  );

  // Swagger Documentation

  const config = new DocumentBuilder()
    .setTitle("TDT SOCIAL")
    .setDescription("Api for TDT social")
    .setVersion("1.0")
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "Enter access token",
      },
      "access_token"
    )
    .build();
  const swaggerDocument = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, swaggerDocument);
  await app.listen(process.env.PORT);
  console.log(`Application is running on port ${process.env.PORT}`);
}
bootstrap();
