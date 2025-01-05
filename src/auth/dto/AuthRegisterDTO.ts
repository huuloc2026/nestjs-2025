import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsDateString, IsEmail, IsIn, IsInstance, IsNotEmpty, IsOptional, IsPhoneNumber, MaxLength, MinLength } from 'class-validator';
import { Expose, Transform, Type } from 'class-transformer';
import { lowerCaseTransformer } from 'src/utils/transformers/lower-case.transformer';


export class AuthRegisterDto {
    @Expose()
    @IsNotEmpty({ message: "name is required" })
    name: string;

    @Expose()
    @IsEmail({}, { message: "Invalid email format" })
    @IsNotEmpty({ message: "password is required" })
    email: string;


    @IsNotEmpty({message:"password is required"})
    @MinLength(6)
    password: string;

    @IsOptional()
    @MinLength(10)
    @IsPhoneNumber('VN',{message:"PhoneVN begin: 09xx.xxx.xxx"})
    phoneNumber:string

    @IsOptional()
    @IsDateString({ strict: true }, { message: "Please valid in YYYY-MM-DD" })
    dateOfBirth:Date

    @Expose()
    @IsOptional()
    @IsIn(["MALE", "FEMALE", "OTHER"], {
        message:
            "Please choose one of the following options: MALE, FEMALE, or OTHER",
    })
    gender: string      

    @Expose()
    @IsOptional()
    @MaxLength(20)
    address: string

    @Expose()
    @IsOptional()      
    avatar: string      
}