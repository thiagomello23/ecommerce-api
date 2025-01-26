import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { RolesModule } from 'src/roles/roles.module';
import { ClientsModule } from '@nestjs/microservices';
import { VendorsModule } from 'src/vendor/vendors.module';

@Module({
  imports: [RolesModule, VendorsModule],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService, ...usersProviders]
})
export class UsersModule {}
