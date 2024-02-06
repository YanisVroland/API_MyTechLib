import { Body, Controller, Get, HttpCode, Post, Req } from '@nestjs/common';
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

  @HttpCode(200)
  @Post('auth')
  async auth(@Body() body: any) {
    return this.supabaseService.auth(body.email, body.password);
  }

  @HttpCode(201)
  @Post('registration')
  async registration(@Body() body: any) {
    return this.supabaseService.registration(body);
  }
}
