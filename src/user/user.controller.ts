import { Controller,Get, Post,Patch,Delete,Param,Body,HttpCode,HttpStatus } from '@nestjs/common';
import {CreateUserDto} from './dtos/create-user.dto'
import {UpdateUserDto} from './dtos/update-user.dto'
import {UserEntity} from './user.entity'
import {v4 as uuid} from 'uuid'
import {ParseIntPipe,ParseUUIDPipe,ValidationPipe,UsePipes,Query} from '@nestjs/common'
import { CustomValidationPipe } from './pipes/validation.pipe';
@Controller('users')
//محتاج اعرف هنا route 
export class UserController {

private  users:UserEntity[] = [];



    @Get()  
find(@Query("username",CustomValidationPipe) username:string,): UserEntity[]{
    return this.users;

}

@Get(":id")
findOne(@Param("id",ParseUUIDPipe) id:string):UserEntity | undefined {
    console.log(typeof id);
    const user:UserEntity | undefined= this.users.find((user)=>user.id==id);
    return user;
}




@Post()
create(@Body(new ValidationPipe()) createUserDto:CreateUserDto){
    const newUser:UserEntity = {
        ...createUserDto,
        id:uuid(),
    }
    this.users.push(newUser)
    return newUser;
}

@Patch(":id")
update(@Param("id",ParseUUIDPipe) id:string ,@Body(new ValidationPipe()) updateUserDto:UpdateUserDto){
    const index = this.users.findIndex((user)=>user.id===id);
        this.users[index]={
            ...this.users[index],
            ...updateUserDto
        }
    return this.users[index];
}

@Delete(':id')
@HttpCode(HttpStatus.NO_CONTENT)
remove(@Param('id',ParseUUIDPipe) id: string) {
    this.users = this.users.filter((user) => user.id !== id);
}


}