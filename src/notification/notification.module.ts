import { Module } from '@nestjs/common';
import { NotificationService } from './notification.service';
import { NotificationController } from './notification.controller';
import { SupabaseModule } from '../supabase/supabase.module';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Module({
  controllers: [NotificationController],
  providers: [NotificationService, DatabaseLogger],
  imports: [SupabaseModule],
  exports: [NotificationService],
})
export class NotificationModule {}
