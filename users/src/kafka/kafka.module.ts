import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { KafkaController } from './kafka.controller';
import { KafkaService } from './kafka.service';

@Module({
  controllers: [KafkaController],
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
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
    ]),
  ],
  providers: [KafkaService],
  exports: [KafkaService],
})
export class KafkaModule {}
