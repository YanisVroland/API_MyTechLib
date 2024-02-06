import { Module } from '@nestjs/common';
import { SupabaseService } from './supabase.service';
import { SupabaseController } from './supabase.controller';
import { DatabaseLogger } from './supabase.logger';
import { Supabase } from './supabase';
import { SupabaseGuard } from './supabase.guard';

@Module({
  controllers: [SupabaseController],
  exports: [SupabaseService, Supabase, SupabaseGuard],
  providers: [SupabaseService, Supabase, SupabaseGuard, DatabaseLogger],
})
export class SupabaseModule {}
