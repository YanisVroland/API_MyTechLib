import { Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Injectable()
export class CopyService {
  private copyTableName = Constants.COPY_LIBRARY_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  generateUniqueString(length) {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  async createCopyLibrary(uuidLibrary: string) {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);
    const uniqueString = this.generateUniqueString(10);
    const body = {
      core_library: uuidLibrary,
      ended_at: twoDaysFromNow,
      code: uniqueString,
    };
    const { data, error } = await this.supabase
      .getClient()
      .from(this.copyTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      return error;
    }

    return data[0];
  }

  async useCopyLibrary(codeStr: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.copyTableName)
      .select(`*`)
      .eq('code', codeStr);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      return error;
    }

    return data;
  }
}
