import { Module } from '@nestjs/common';
import { CopyService } from './copy.service';
import { CopyController } from './copy.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Module({
  controllers: [CopyController],
  imports: [SupabaseModule],
  providers: [CopyService, DatabaseLogger],
  exports: [CopyService],
})
export class CopyModule {}
