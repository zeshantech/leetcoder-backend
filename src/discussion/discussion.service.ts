import { Injectable } from '@nestjs/common';
import { CreateDiscussionInput } from './dto/create-discussion.input';
import { UpdateDiscussionInput } from './dto/update-discussion.input';

@Injectable()
export class DiscussionService {
  create(createDiscussionInput: CreateDiscussionInput) {
    return 'This action adds a new discussion';
  }

  findAll() {
    return `This action returns all discussion`;
  }

  findOne(id: number) {
    return `This action returns a #${id} discussion`;
  }

  update(id: number, updateDiscussionInput: UpdateDiscussionInput) {
    return `This action updates a #${id} discussion`;
  }

  remove(id: number) {
    return `This action removes a #${id} discussion`;
  }
}
