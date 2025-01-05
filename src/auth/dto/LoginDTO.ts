
import {  IsEmail,  IsNotEmpty, IsOptional, IsPhoneNumber, MaxLength, MinLength } from 'class-validator';
import { Expose  } from 'class-transformer';



export class LoginDTO {
    @Expose()
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "field email is required" })
    email: string;

    @Expose()
    @IsNotEmpty({message:"field password is required"})
    password: string;

}