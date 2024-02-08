import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService, DatabaseLogger],
  imports: [SupabaseModule],
  exports: [LibraryService],
})
export class LibraryModule {}
