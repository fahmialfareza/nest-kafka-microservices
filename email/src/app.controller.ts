import { MailerService } from '@nestjs-modules/mailer';
import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { KafkaMessage } from 'kafkajs';

@Controller()
export class AppController {
  constructor(private mailerService: MailerService) {}

  @MessagePattern('email_topic')
  async event(@Payload() message: KafkaMessage) {
    try {
      this[message.key.toString()](message.value);
    } catch (error) {
      console.log(error.message);
    }
  }

  async sendRegisterEmail(data: any) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Terima kasih telah mendaftar',
      html: `Anda telah terdaftar menjadi member di Aplikasi Nest Kafka Microservices.`,
    });
  }

  async sendLoginEmail(data: any) {
    await this.mailerService.sendMail({
      to: data.email,
      subject: 'Seseorang telah masuk',
      html: `Seseorang telah masuk menggunakan akun anda.`,
    });
  }
}
