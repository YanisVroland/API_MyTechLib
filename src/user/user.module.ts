import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { FirebaseModule } from '../firebase/firebase.module';

@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseLogger],
  imports: [SupabaseModule, FirebaseModule],
  exports: [UserService],
})
export class UserModule {}
