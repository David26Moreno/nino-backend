
import { Body, Controller, Post } from '@nestjs/common';
import { ChatMessageDto } from './dto/chat-message.dto';

@Controller('chat')
export class ChatController {
    @Post()
    sendMessage(@Body() body: ChatMessageDto) {
        return {
            reply: `Recibí tu mensaje: "${body.message}". Backend conectado correctamente.`,
        };
    }
}