import { IsNotEmpty, IsString } from 'class-validator';

export class CreateChatMessageDto {
  @IsString()
  @IsNotEmpty()
  message!: string;
}
