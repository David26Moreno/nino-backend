import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get()
  getHello() {
    return {
      app: 'Nino IA API',
      status: 'running',
    };
  }

  @Get('health')
  getHealth() {
    return {
      status: 'ok',
      service: 'nino-ai-api',
      timestamp: new Date().toISOString(),
    };
  }
}