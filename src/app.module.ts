import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CaslModule } from './casl/casl.module';
import { RolesModule } from './roles/roles.module';
import { PermissionsModule } from './permissions/permissions.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { microservicesRMQKey } from './constants';
import { RmqModule } from './rmq/rmq.module';
import { VendorsModule } from './vendor/vendors.module';
import { AddressModule } from './address/address.module';
import { CategoriesModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { ProductsVariantsModule } from './products-variants/products-variants.module';
import { ProductsFilesModule } from './products-files/products-files.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      global: true,

    }),
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule,
    AuthModule,
    CaslModule,
    RolesModule,
    PermissionsModule,
    RmqModule,
    VendorsModule,
    AddressModule,
    CategoriesModule,
    ProductsModule,
    ProductsVariantsModule,
    ProductsFilesModule
  ],
  controllers: [],
  providers: [],
  exports: []
})
export class AppModule {}