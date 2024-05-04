import { Module } from '@nestjs/common';
import { CopyService } from './copy.service';
import { CopyController } from './copy.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { LibraryModule } from '../library/library.module';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [CopyController],
  imports: [SupabaseModule, ProjectModule, LibraryModule],
  providers: [CopyService, DatabaseLogger],
  exports: [CopyService],
})
export class CopyModule {}
