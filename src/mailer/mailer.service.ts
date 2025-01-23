import { Injectable } from '@nestjs/common';
import { CreateMailerDto } from './dto/create-mailer.dto';
import { UpdateMailerDto } from './dto/update-mailer.dto';

@Injectable()
export class MailerService {
  create(createMailerDto: CreateMailerDto) {
    return 'This action adds a new mailer';
  }

  findAll() {
    return `This action returns all mailer`;
  }

  findOne(id: string) {
    return `This action returns a #${id} mailer`;
  }

  update(id: string, updateMailerDto: UpdateMailerDto) {
    return `This action updates a #${id} mailer`;
  }

  remove(id: string) {
    return `This action removes a #${id} mailer`;
  }
}
