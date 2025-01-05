import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional } from 'class-validator';


export class AuthResponseDTO {
    @Expose()
    name: string;

    @Expose()
    email: string;

    @Exclude()
    password: string;

    @Expose()
    phoneNumber?:string

    @Expose()
    dateOfBirth:Date

    @Expose()
    gender: string      

    @Expose()
    address: string

    @Expose()
    @IsOptional()
    isVerified: Boolean

    @Expose()
    avatar: string

    @Expose()
    accessToken: string;


    @Expose()
    refreshToken: string;
}