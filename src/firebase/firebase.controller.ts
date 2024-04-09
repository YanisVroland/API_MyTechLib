import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FirebaseService } from './firebase.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('firebase')
export class FirebaseController {
  constructor(private readonly firebaseService: FirebaseService) {}

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: any): Promise<unknown> {
  //   return this.firebaseService.uploadFile(file, 'uploads');
  // }
}
