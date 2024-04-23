import { Module } from '@nestjs/common';
import { ProjectService } from './project.service';
import { ProjectController } from './project.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [ProjectController],
  providers: [ProjectService, DatabaseLogger],
  imports: [SupabaseModule, FirebaseModule],
  exports: [ProjectService],
})
export class ProjectModule {}
