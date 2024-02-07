import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Module({
  controllers: [UserController],
  providers: [UserService, DatabaseLogger],
  imports: [SupabaseModule],
  exports: [UserService],
})
export class UserModule {}
