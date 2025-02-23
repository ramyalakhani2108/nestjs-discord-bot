import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RoleMaster } from '../entities/role-master.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RoleMasterService {
    constructor(
        @InjectRepository(RoleMaster)
        private readonly roleMasterRepository: Repository<RoleMaster>,
    ) {}

    async findAll(): Promise<RoleMaster[]> {
        return await this.roleMasterRepository.find({
            select: {
                id: true,
                role: true,
                description: true,
            }
        });
    }

    async findById(id: number): Promise<RoleMaster>{
        return await this.roleMasterRepository.findOneByOrFail({id});
    }
}
