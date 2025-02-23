import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRequests } from './entities/user-request.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserRequests])],
  providers: [UsersService],
  exports: [UsersService]
})
export class UsersModule {}
