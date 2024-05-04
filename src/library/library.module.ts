import { Module } from '@nestjs/common';
import { LibraryService } from './library.service';
import { LibraryController } from './library.controller';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { SupabaseModule } from '../supabase/supabase.module';
import { FirebaseModule } from '../firebase/firebase.module';
import { ProjectModule } from '../project/project.module';

@Module({
  controllers: [LibraryController],
  providers: [LibraryService, DatabaseLogger],
  imports: [SupabaseModule, ProjectModule, FirebaseModule],
  exports: [LibraryService],
})
export class LibraryModule {}
