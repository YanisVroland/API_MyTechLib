import { Controller, Get, HttpCode } from '@nestjs/common';
import { SupabaseService } from './supabase.service';

@Controller('supabase')
export class SupabaseController {
  constructor(private readonly supabaseService: SupabaseService) {}

  @HttpCode(200)
  @Get('ping')
  async ping() {
    return this.supabaseService.ping();
  }
}
