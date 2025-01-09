import { Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @Expose()
  @IsNotEmpty()
  email: string;

  @Expose()
  @IsNotEmpty()
  password: string;

  @Expose()
  @IsOptional()
  name: string;

  @Expose()
  @IsOptional()
  @IsPhoneNumber('VN')
  phoneNumber: string; // Phù hợp với User entity

  @Expose()
  @IsOptional()
  avatar: string;

  @Expose()
  @IsOptional()
  @IsEnum(['Male', 'Female', 'Other'])
  gender: 'Male' | 'Female' | 'Other'; // Phù hợp với User entity

  @Expose()
  @IsOptional()
  address: string;
}
