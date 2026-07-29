import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiService, AiGenerateDto } from './ai.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('generate')
  async generateText(@Body() dto: AiGenerateDto): Promise<{ text: string }> {
    return this.aiService.generateText(dto);
  }
}
