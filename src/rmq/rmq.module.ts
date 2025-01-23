import { Global, Module } from "@nestjs/common";
import { ClientsModule, Transport } from "@nestjs/microservices";
import { microservicesRMQKey } from "src/constants";

@Global()
@Module({
  imports: [
    ClientsModule.register([{
      name: microservicesRMQKey.MESSAGE_QUEUE,
      transport: Transport.RMQ,
      options: {
        urls: ["amqp://localhost:5672"],
        queue: microservicesRMQKey.MESSAGE_QUEUE,
        queueOptions: { durable: true }
      }
    }])
  ],
  exports: [ClientsModule]
})
export class RmqModule {}