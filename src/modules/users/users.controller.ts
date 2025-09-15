import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpException, HttpStatus, ParseIntPipe, UseInterceptors } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AuditInterceptor } from '../../common/interceptors/audit.interceptor';
import { Audit } from '../../common/decorators/audit.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
@UseInterceptors(AuditInterceptor)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Audit({ action: 'CREATE_USER', resource: 'User' })
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      return await this.usersService.create(createUserDto);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @Audit({ action: 'UPDATE_USER', resource: 'User' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @Audit({ action: 'DELETE_USER', resource: 'User' })
  async remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }

@Get(':id/profile')
async getProfile(@Param('id') id: string) {
  return this.usersService.getProfile(id);
}

@Get(':id/posts')
async getPosts(@Param('id') id: string) {
  return this.usersService.getPosts(id);
}

@Get(':id/drafts')
async getDrafts(@Param('id') id: string) {
  return this.usersService.getDrafts(id);
}

@Get(':id/bookmarks')
async getBookmarks(@Param('id') id: string) {
  return this.usersService.getBookmarks(id);
}

@Get(':id/followers')
async getFollowers(@Param('id') id: string) {
  return this.usersService.getFollowers(id);
}

@Get(':id/following')
async getFollowing(@Param('id') id: string) {
  return this.usersService.getAllFollowing(id);
}

@Get(':id/notifications')
async getNotifications(@Param('id') id: string) {
  return this.usersService.getNotifications(id);
}
}