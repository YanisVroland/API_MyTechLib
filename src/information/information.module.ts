import { Module } from '@nestjs/common';
import { InformationService } from './information.service';
import { InformationController } from './information.controller';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { SupabaseModule } from '../supabase/supabase.module';

@Module({
  controllers: [InformationController],
  providers: [InformationService, DatabaseLogger],
  imports: [SupabaseModule],
  exports: [InformationService],
})
export class InformationModule {}
