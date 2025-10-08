import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { CreateUserProfileDto } from './dto/create-user-profile.dto';
import { UpdateUserProfileDto } from './dto/update-user-profile.dto';
import { Post } from '../posts/entities/post.entity';
import { Draft } from '../drafts/entities/draft.entity';
import { Bookmark } from '../bookmarks/entities/bookmark.entity';
import { CategoryFollower } from '../category-followers/entities/category-follower.entity';
import { AuthorFollower } from '../author-followers/entities/author-follower.entity';
import { Notification } from '../notifications/entities/notification.entity';
import { Category } from '../categories/entities/category.entity';
import { Role } from '../roles/entities/role.entity';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,

    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,

    @InjectRepository(Post)
    private postRepository: Repository<Post>,

    @InjectRepository(Draft)
    private draftRepository: Repository<Draft>,

    @InjectRepository(Bookmark)
    private bookmarkRepository: Repository<Bookmark>,

    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,

    @InjectRepository(CategoryFollower)
    private categoryFollowerRepository: Repository<CategoryFollower>,

    @InjectRepository(AuthorFollower)
    private authorFollowerRepository: Repository<AuthorFollower>,

    @InjectRepository(Notification)
    private readonly notificationRepository: Repository<Notification>,

    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Get role ID based on role name
    if (createUserDto.role) {
      const role = await this.roleRepository.findOne({
        where: { slug: createUserDto.role },
      });

      if (role) {
        createUserDto.role_id = role.id;
      }
    }

    const user = this.userRepository.create(createUserDto);
    return this.userRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find({
      where: { role: Not('super_admin') },
      select: [
        'id',
        'username',
        'email',
        'role',
        'role_id',
        'status',
        'created_at',
        'updated_at',
      ],
    });
  }

  async findOne(id: string): Promise<User> {
    if (!id) {
      throw new BadRequestException('Invalid user ID');
    }
    const user = await this.userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOne({
      where: { email },
      select: [
        'id',
        'username',
        'email',
        'role',
        'role_id',
        'status',
        'created_at',
        'updated_at',
      ],
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

    const profile = await this.userProfileRepository.findOne({
      where: { user_id: userId },
      relations: ['user'],
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    return profile;
  }

  async createProfile(
    createProfileDto: CreateUserProfileDto,
  ): Promise<UserProfile> {
    // Check if profile already exists
    const existingProfile = await this.userProfileRepository.findOne({
      where: { user_id: createProfileDto.user_id },
    });

    if (existingProfile) {
      throw new BadRequestException('User profile already exists');
    }

    const profile = this.userProfileRepository.create(createProfileDto);
    return this.userProfileRepository.save(profile);
  }

  async updateProfile(
    userId: string,
    updateProfileDto: UpdateUserProfileDto,
  ): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    await this.userProfileRepository.update(profile.id, updateProfileDto);
    return this.getProfile(userId);
  }

  async uploadProfilePicture(
    userId: string,
    filename: string,
  ): Promise<UserProfile> {
    const profile = await this.userProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      // Create profile if it doesn't exist
      const newProfile = await this.createProfile({
        user_id: userId,
        profile_picture: filename,
      });
      return newProfile;
    }

    // Delete old profile picture if exists
    if (profile.profile_picture) {
      const oldFilePath = path.join(
        process.cwd(),
        'uploads',
        'profile-pictures',
        profile.profile_picture,
      );
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
    }

    await this.userProfileRepository.update(profile.id, {
      profile_picture: filename,
    });
    return this.getProfile(userId);
  }

  async deleteProfile(userId: string): Promise<void> {
    const profile = await this.userProfileRepository.findOne({
      where: { user_id: userId },
    });

    if (!profile) {
      throw new NotFoundException('User profile not found');
    }

    // Delete profile picture file if exists
    if (profile.profile_picture) {
      const filePath = path.join(
        process.cwd(),
        'uploads',
        'profile-pictures',
        profile.profile_picture,
      );
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await this.userProfileRepository.delete(profile.id);
  }

  async getPosts(userId: string) {
    if (!userId) throw new BadRequestException('Invalid user ID');

    return this.postRepository.find({
      where: { user: { id: String(userId) } }, // relation to User entity
      relations: ['category', 'comments', 'reactions'],
    });
  }

  async getDrafts(userId: string) {
    if (!userId) throw new BadRequestException('Invalid user ID');

    return this.draftRepository.find({
      where: { user: { id: String(userId) } },
    });
  }

  async getBookmarks(userId: string) {
    if (!userId) throw new BadRequestException('Invalid user ID');

    return this.bookmarkRepository.find({
      where: { user: { id: String(userId) } },
      relations: ['post'],
    });
  }

  async getFollowers(userId: string) {
    if (!userId || userId.trim() === '') {
      throw new BadRequestException('Invalid user ID');
    }

    const followers = await this.authorFollowerRepository.find({
      where: { author_id: userId },
      relations: ['follower'],
      order: { created_at: 'DESC' },
    });

    return followers;
  }

  async getAllFollowing(userId: string) {
    const categoryFollows = await this.categoryFollowerRepository.find({
      where: { user_id: userId },
      relations: ['category'],
    });

    const authorFollows = await this.authorFollowerRepository.find({
      where: { follower_id: userId },
      relations: ['author'],
    });

    return {
      categories: categoryFollows.map((f) => ({
        id: f.id,
        type: 'category',
        followed: f.category,
        createdAt: f.created_at,
      })),
      authors: authorFollows.map((f) => ({
        id: f.id,
        type: 'author',
        followed: f.author,
        createdAt: f.created_at,
      })),
    };
  }

  async getNotifications(userId: string) {
    if (!userId) throw new BadRequestException('Invalid user ID');

    return this.notificationRepository.find({
      where: { userId: userId } as any,
      order: { createdAt: 'DESC' } as any,
    });
  }
}
