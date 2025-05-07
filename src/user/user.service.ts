import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  ICreateUserInput,
  UpdateUserProfileInput,
  UpdateUserPasswordInput,
} from './dto/user.input';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOneOptions, FindOptionsWhere, Not, Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findOneUser(
    filter: FindOneOptions<User>['where'],
    options?: FindOneOptions<User>,
  ) {
    return this.userRepository.findOne({ where: filter, ...options });
  }

  async getOneUser(
    filter: FindOneOptions<User>['where'],
    options?: FindOneOptions<User>,
  ) {
    const user = await this.userRepository.findOne({
      where: filter,
      ...options,
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async updateUserProfile(input: UpdateUserProfileInput, user: CurrentUser) {
    const existingUser = await this.getOneUser({
      username: input.username,
      id: Not(user.id),
    });
    if (existingUser) {
      throw new ConflictException('Username already exists');
    }

    const updatedUser = await this.userRepository.update(user.id, input);
    if (updatedUser.affected === 0) {
      throw new NotFoundException('User not found');
    }
  }

  async createUser(input: ICreateUserInput) {
    const user = this.userRepository.create(input);
    await this.userRepository.save(user);

    return user;
  }

  async updateUser(filter: FindOptionsWhere<User>, input: Partial<User>) {
    return this.userRepository.update(filter, input);
  }

  async updateUserPassword(
    input: UpdateUserPasswordInput,
    currentUser: CurrentUser,
  ) {
    const user = await this.getOneUser({ id: currentUser.id });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.userRepository.update(user.id, {
      password: input.newPassword,
    });
  }
}
