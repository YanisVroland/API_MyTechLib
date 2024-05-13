import {
  Controller,
  Post,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';

// Controller responsible for handling Firebase-related HTTP requests
@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // Endpoint for uploading files to Firebase
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: any): Promise<unknown> {
    // Call the Firebase service method to upload the file to the 'uploads' directory
    return this.firebaseService.uploadFile(file, 'uploads');
  }
}
