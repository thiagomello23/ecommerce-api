import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { RolesModule } from 'src/roles/roles.module';
import { ClientsModule } from '@nestjs/microservices';
import { VendorsModule } from 'src/vendor/vendors.module';
import { AddressModule } from 'src/address/address.module';

@Module({
  imports: [RolesModule, VendorsModule, forwardRef(() => AddressModule)],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService, ...usersProviders]
})
export class UsersModule {}
