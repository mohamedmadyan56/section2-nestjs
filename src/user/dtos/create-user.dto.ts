import {IsString,IsEmail,IsInt,Min,Max,IsOptional} from 'class-validator'










export class CreateUserDto {
    @IsString()

    username:string;
    @IsEmail()
    email:string;
    country:string;

}
