import { HttpException, Injectable } from '@nestjs/common';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { Constants } from '../utils/Constants';

@Injectable()
export class LibraryService {
  private libraryTableName = Constants.CORE_LIBRARY_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
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
      .select(`*`)
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
      .eq('belongs_to', uuidUser);

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
    body.updated_at = new Date();
    const { data, error } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .update(body)
      .eq('uuid', uuidLibrary)
      .select();

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
}
