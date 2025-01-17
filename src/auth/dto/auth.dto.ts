import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class AuthSignupDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()

  email: string;

  @IsNotEmpty()
  @IsString()

  password: string;
}
