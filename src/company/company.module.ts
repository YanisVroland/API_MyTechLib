import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { SupabaseModule } from '../supabase/supabase.module';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, DatabaseLogger],
  imports: [SupabaseModule, FirebaseModule],
  exports: [CompanyService],
})
export class CompanyModule {}
