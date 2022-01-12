import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: ['pkc-l9wvm.ap-southeast-1.aws.confluent.cloud:9092'],
          ssl: true,
          sasl: {
            mechanism: 'plain',
            username: 'VC75EAMFSDKFWJN7',
            password:
              '3wt7yfEam6U3L03fzTbggU9ojMbVHOd31MzYQ0ekkJryMVVLpJmrODAJJX+uxspt',
          },
        },
      },
    },
  );
  app.listen();
}
bootstrap();
