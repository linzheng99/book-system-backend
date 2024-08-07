import { CreateBookDto } from './create-book.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateBookDto extends CreateBookDto {
  @IsNotEmpty({ message: 'id 不能为空' })
  id: number;
}
