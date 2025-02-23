import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusMaster } from './entities/status_master.entity';
import { RoleMaster } from './entities/role-master.entity';
import { RoleMasterService } from './services/role-master.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([StatusMaster, RoleMaster])
    ],
    controllers: [],
    providers: [RoleMasterService],
    exports: [RoleMasterService]
})
export class StatusMasterModule {}
