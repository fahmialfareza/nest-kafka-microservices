import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { KafkaModule } from './kafka/kafka.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 33060,
      username: 'root',
      password: 'root',
      database: 'users',
      autoLoadEntities: true,
      synchronize: true,
    }),
    UserModule,
    KafkaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
