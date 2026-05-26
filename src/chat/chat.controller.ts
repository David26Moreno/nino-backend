
import { Body, Controller, Post } from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatMessageDto } from './dto/create-chat-message.dto';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

    @Post()
  sendMessage(@Body() body: CreateChatMessageDto) {
    const response = this.chatService.getMockReply(body.message);

    return {
      ...response,
      createdAt: new Date().toISOString(),
    };
  }
}