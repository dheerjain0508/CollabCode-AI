import {Body,Controller,Get,Param,Patch,Post,} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { CreateUserDto } from './dto/create-user.dto';
import {AllowAnonymous,Session,} from '@thallesp/nestjs-better-auth';
import type {UserSession,} from '@thallesp/nestjs-better-auth';
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
@Get('me')
getMyProfile(@Session() session: UserSession) {
  return this.usersService.getUserProfile(session.user.id);
}
  @Get(':id')
  getUserProfile(@Param('id') id: string) {
    return this.usersService.getUserProfile(id);
  }
@Post()
createUser(@Body() createUserDto: CreateUserDto) {
  return this.usersService.createUser(createUserDto);
}
  @Patch(':id/profile')
  updateProfile(
    @Param('id') id: string,
    @Body() updateProfileDto: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(id, updateProfileDto);
  }
}