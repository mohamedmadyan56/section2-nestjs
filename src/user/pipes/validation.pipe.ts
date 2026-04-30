
import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';

@Injectable()
export class CustomValidationPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    // console.log('My custom validation pipe ', value); 
    //write your logic here  (Transformition or validation )
    return 'DEV' + value;
  }
}
