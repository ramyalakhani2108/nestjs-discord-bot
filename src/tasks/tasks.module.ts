import { Module } from '@nestjs/common';
import { AssignCommand } from './commands/assign.command';

@Module({
  providers: [AssignCommand]
})
export class TasksModule {}
