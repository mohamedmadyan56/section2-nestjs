
import {PartialType} from '@nestjs/mapped-types'
import {CreateUserDto} from './create-user.dto'


//PartialType 
export class UpdateUserDto extends PartialType(CreateUserDto) {
   
}
