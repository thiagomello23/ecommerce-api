import { forwardRef, Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { RolesModule } from 'src/roles/roles.module';
import { VendorsModule } from 'src/vendor/vendors.module';
import { AddressModule } from 'src/address/address.module';
import { UsersControllers } from './users.controller';
import { FilesModule } from 'src/files/files.module';

@Module({
  imports: [RolesModule, VendorsModule, forwardRef(() => AddressModule), FilesModule],
  controllers: [UsersControllers],
  providers: [UsersService, ...usersProviders],
  exports: [UsersService, ...usersProviders]
})
export class UsersModule {}
