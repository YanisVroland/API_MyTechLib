import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, DatabaseLogger],
  imports: [SupabaseModule],
  exports: [ProjectService],
})
export class ProjectModule {}
