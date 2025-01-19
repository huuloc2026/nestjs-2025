import { Exclude, Expose } from 'class-transformer';
import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
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
  @IsPhoneNumber('VN',{message: "Format PhoneVN: 09xx.xxx.xxx"})
  phoneNumber: string;
  
  @Expose()
  @IsOptional()
  avatar: string;

  @Expose()
  @IsOptional()
  @IsEnum(GENDER)
  gender: GENDER;

  @Expose()
  @IsOptional()
  address: string;
}
