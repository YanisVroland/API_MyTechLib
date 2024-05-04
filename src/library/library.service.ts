import { HttpException, Injectable } from '@nestjs/common';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { Constants } from '../utils/Constants';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class LibraryService {
  private libraryTableName = Constants.CORE_LIBRARY_TABLE_NAME;
  private projectTableName = Constants.CORE_PROJECT_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
  ) {}

  async getLibrary(uuidLibrary: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .select(`*`)
      .eq('uuid', uuidLibrary);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async getLibrariesByCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .select(`*,created_by(name,lastName,uuid)`)
      .eq('core_company', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async getLibrariesByUser(uuidUser: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .select(`*,created_by(name,lastName,uuid)`)
      .eq('belongs_to', uuidUser)
      .eq('is_personal', true);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async createLibrary(body: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async updateLibrary(uuidLibrary: string, body: any) {
    // body.updated_at = new Date();

    const { data, error } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .update(body)
      .eq('uuid', uuidLibrary)
      .select(`*,created_by(name,lastName,uuid)`);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async updateLibraryCountProject(uuidLibrary: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select('count', { count: 'exact' })
      .eq('core_library', uuidLibrary);

    await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .update({ project_count: data[0].count })
      .eq('uuid', uuidLibrary);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async deleteLibrary(uuidLibrary: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .delete()
      .eq('uuid', uuidLibrary)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async uploadLogoLibrary(file: any, uuidLibrary: string) {
    if (!file) throw new HttpException('File not found', 400);
    const url = await this.storageFirebase.uploadFile(
      file,
      'library/' + uuidLibrary,
    );

    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    return this.updateLibrary(uuidLibrary, { logo_url: url });
  }

  async uploadBannerLibrary(file: any, uuidLibrary: string) {
    if (!file) throw new HttpException('File not found', 400);
    const url = await this.storageFirebase.uploadFile(
      file,
      'library/' + uuidLibrary,
    );

    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    return this.updateLibrary(uuidLibrary, { banner_url: url });
  }
}
