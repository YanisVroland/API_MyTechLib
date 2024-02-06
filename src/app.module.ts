import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { FirebaseModule } from './firebase/firebase.module';

@Module({
  imports: [SupabaseModule, FirebaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
