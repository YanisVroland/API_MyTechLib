import { Controller, Get, HttpCode, Req } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @HttpCode(200)
  @Get('ping')
  async ping(@Req() request) {
    const [token] = request.headers.authorization?.split(' ') ?? [];
    return this.supabaseService.ping(token);
  }
}
