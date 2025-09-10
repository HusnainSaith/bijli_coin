import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      select: ['id', 'username', 'email', 'role', 'role_id', 'status', 'created_at', 'updated_at'],
    });
  }

  async findOne(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.userRepository.findOne({
      where: { id },
    });
    console.log('UsersService findOne result:', user); // Debug log
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'role', 'role_id', 'status', 'created_at', 'updated_at'],
    });
  }

  async findByEmailWithPassword(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    await this.userRepository.update(id, updateUserDto);
    return this.findOne(id);
  }

  async updatePassword(id: string, hashedPassword: string): Promise<void> {
    await this.userRepository.update(id, { password: hashedPassword });
  }

  async remove(id: string): Promise<void> {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async getProfile(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    // Return null - implement when UserProfile entity is properly related
    return null;
  }

  async getPosts(userId: string) {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    // Return empty array - implement when Post entity is properly related
    return [];
  }

  async getDrafts(userId:string) {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    // Return empty array - implement when Draft entity is properly related
    return [];
  }

  async getBookmarks(userId:string) {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    // Return empty array - implement when Bookmark entity is properly related
    return [];
  }

  async getFollowers(userId:string) {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    // Return empty array - implement when Follower entity is properly related
    return [];
  }

  async getFollowing(userId:string) {
    if (!userId ) {
      throw new BadRequestException('Invalid user ID');
    }
    // Return empty array - implement when Following entity is properly related
    return [];
  }

  async getNotifications(userId:string) {
    if (!userId) {
      throw new BadRequestException('Invalid user ID');
    }
    // Return empty array - implement when Notification entity is properly related
    return [];
  }
  async findOneWithRoleAndPermissions(userId: string) {
  return this.userRepository.findOne({
    where: { id: userId },
    relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
  });
  }
}