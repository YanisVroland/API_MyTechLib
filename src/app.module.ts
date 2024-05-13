import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SupabaseModule } from './supabase/supabase.module';
import { FirebaseModule } from './firebase/firebase.module';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { CompanyModule } from './company/company.module';
import { LibraryModule } from './library/library.module';
import { ProjectModule } from './project/project.module';
import { InformationModule } from './information/information.module';
import { CopyModule } from './copy/copy.module';

@Module({
  // Import all required modules
  imports: [
    // Load environment variables from .env file globally
    ConfigModule.forRoot({
      envFilePath: '.env',
      isGlobal: true,
    }),
    // Import modules for Supabase and Firebase
    SupabaseModule,
    FirebaseModule,
    // Import user-related module
    UserModule,
    // Import company-related module
    CompanyModule,
    // Import library-related module
    LibraryModule,
    // Import project-related module
    ProjectModule,
    // Import information-related module
    InformationModule,
    // Import copy-related module
    CopyModule,
  ],
  // Declare controllers used in the application
  controllers: [AppController],
  // Declare services/providers used in the application
  providers: [AppService],
})
export class AppModule {}
