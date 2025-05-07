import { Injectable } from '@nestjs/common';
import { CreateContestInput } from './dto/create-contest.input';
import { UpdateContestInput } from './dto/update-contest.input';

@Injectable()
export class ContestService {
  create(createContestInput: CreateContestInput) {
    return 'This action adds a new contest';
  }

  findAll() {
    return `This action returns all contest`;
  }

  findOne(id: number) {
    return `This action returns a #${id} contest`;
  }

  update(id: number, updateContestInput: UpdateContestInput) {
    return `This action updates a #${id} contest`;
  }

  remove(id: number) {
    return `This action removes a #${id} contest`;
  }
}
