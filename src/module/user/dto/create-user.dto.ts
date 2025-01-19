import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDate,
  isDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  MaxLength,
} from 'class-validator';
import { GENDER } from 'src/module/user/entities/EUser';


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
  @IsPhoneNumber('VN', { message: 'Format PhoneVN: 09xx.xxx.xxx' })
  phoneNumber: string;

  @Expose()
  @IsOptional()
  avatar: string;

  @Expose()
  @IsOptional({ message: 'Date of Birth have a valid format: YYYY-MM-DD'})
  @IsDate()
  @Type(() => Date)
  dateOfBirth: Date;

  @Expose()
  @IsOptional()
  @IsEnum(GENDER)
  gender: GENDER;

  @Expose()
  @IsOptional()
  @MaxLength(20)
  address: string;
}
