import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Injectable()
export class KafkaService {
  constructor(@Inject('KAFKA_SERVICE') private client: ClientKafka) {}

  async emit(topic: string[], key: string, value: any) {
    for (let i = 0; i < topic.length; i++) {
      this.client.emit(topic[i], {
        key,
        value: JSON.stringify(value),
      });
    }
  }
}
