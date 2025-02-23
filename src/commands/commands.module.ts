import { Module } from '@nestjs/common';
import { PingCommand } from './ping.command';
import { BeAPartOfProjectCommand } from './be-a-part-of-project.command';
import { UsersModule } from 'src/users/users.module';
import { StatusMasterModule } from 'src/status_master/status_master.module';
import { UserRequestsCommand } from './user-requests.command';

@Module({
    imports: [UsersModule, StatusMasterModule],
    controllers: [],
    providers: [PingCommand, BeAPartOfProjectCommand, UserRequestsCommand],
    exports: [PingCommand, BeAPartOfProjectCommand]
})
export class CommandsModule {}















