import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        profile: true,
        skills: {
          include: {
            skill: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }
async createUser(createUserDto: CreateUserDto) {
  return this.prisma.user.create({
    data: createUserDto,
  });
}
  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
  console.log('PATCH USER ID:', userId);

  const user = await this.prisma.user.findUnique({
    where: { id: userId },
  });

  console.log('FOUND USER:', user);

  if (!user) {
    throw new NotFoundException('User not found');
  }

  return this.prisma.profile.upsert({
    where: {
      userId,
    },
    update: updateProfileDto,
    create: {
      userId,
      ...updateProfileDto,
    },
  });
}
}