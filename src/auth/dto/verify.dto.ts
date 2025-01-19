import { Expose } from "class-transformer";
import { IsNumber, MaxLength, MinLength } from "class-validator";

export class VerifyDTO {
    @Expose()
    code:number
}