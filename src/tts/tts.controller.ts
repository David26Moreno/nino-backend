import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { createReadStream } from 'fs';
import { TtsService } from './tts.service';
import { CreateTtsDto } from './dto/create-tts.dto';

@Controller('tts')
export class TtsController {
  constructor(private readonly ttsService: TtsService) {}

  @Post()
  async synthesize(@Body() body: CreateTtsDto, @Res() res: Response) {
    const outputPath = await this.ttsService.synthesize(body.text);

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Content-Disposition', 'inline; filename="nino.wav"');

    const stream = createReadStream(outputPath);
    stream.pipe(res);
  }
}

