import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatModule } from './chat/chat.module';
import { TtsModule } from './tts/tts.module';

@Module({
  imports: [ChatModule, TtsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
