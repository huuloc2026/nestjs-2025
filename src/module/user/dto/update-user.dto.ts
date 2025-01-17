import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { User } from 'src/module/user/entities/user.entity';

export class UpdateUserDto extends PartialType(User) {}
