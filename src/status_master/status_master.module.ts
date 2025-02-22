import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusMaster } from './entities/status_master.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([StatusMaster])
    ],
    controllers: [],
    providers: [],
})
export class StatusMasterModule {}
