import { Injectable, NotFoundException } from '@nestjs/common';
import {  User } from 'discord.js';
import { RegisterForProject } from './types/register-for-project.type';
import { UserRequests } from './entities/user-request.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StatusId } from 'src/status_master/enums/status.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserRequests)
    private readonly userRequestsRepository: Repository<UserRequests>,
  ){}
  // Implement user-related functionality here.
  async addUserToProject(data: RegisterForProject, user: User) {
    let isRequestExists: UserRequests | null = null;
    try {
      isRequestExists = await this.userRequestsRepository.findOne({
        where: {
          dcUserId: Number(user.id),
        },
        relations: ['status'],
      });
    } catch (error) {
      return {
        status: false,
        message: 'Something went wrong'
      }
    }

    if (isRequestExists && isRequestExists.status.id == StatusId.PENDING) {
      return {
        status: false,
        message: ` You have already requested for a project. wait for it or try to contact with <@${process.env.DISCORD_ADMIN_USER_ID}>`
      };
    }

    if(isRequestExists && isRequestExists.status.id == StatusId.ACCEPTED) {
      return {
        status: false,
        message: `You have already accepted a project. If you want to change your role or skills, contact with <@${process.env.DISCORD_ADMIN_USER_ID}>`
      }
    }

    if(isRequestExists && isRequestExists.status.id == StatusId.REJECTED) {
      return {
        status: false,
        message: `You have already rejected a project. If you want to change your role or skills, contact with <@${process.env.DISCORD_ADMIN_USER_ID}>`
      }
    }

    let newRequest = this.userRequestsRepository.create({
      dcUserId: Number(user.id),
      dcUsername: user.username,
      forRole: { id: Number(data.role) },
      skills: data.skills.split(','),
      availableTime: Number(data.time),
      expectations: data.expectations,
      status: { id: StatusId.PENDING },
    })

    try {
      newRequest = await this.userRequestsRepository.save(newRequest);
    } catch (error) {
        return {
          status: false,
          message: 'Failed to save user request.'
        }
    }

    if(!newRequest){
      return {
        status: false,
        message: 'Failed to save user request.'
      }
    }

    // data.role = 
    return {
      status: true,
      message: 'User request saved successfully.',
      data
    }
  } 

  async getUserRequest(userId: number) {
    const userRequest = await this.userRequestsRepository.findOne({
        where: { dcUserId: userId },
        relations: ['status', 'forRole'],   
    });
    return userRequest;
  }

  async updateUserRequestStatus(userId: number, action: string) {
    const userRequest = await this.getUserRequest(userId);
    if (!userRequest) {
      throw new NotFoundException('User request not found');
    }
    if (action === 'accept') {
      userRequest.status.id = StatusId.ACCEPTED;
    }
    else{
      userRequest.status.id = StatusId.REJECTED;
    }

    try {
      await this.userRequestsRepository.save(userRequest);
    } catch (error) {
      throw new Error('Failed to update user request status');
    }
  }
}
