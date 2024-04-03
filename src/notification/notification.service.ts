import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';

@Injectable()
export class NotificationService {
  private notificationTableName = Constants.CORE_NOTIFICATION_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
  ) {}

  async getNotificationByCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.notificationTableName)
      .select(`*`)
      .eq('core_company', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async getOneNotification(uuidNotification: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.notificationTableName)
      .select(`*`)
      .eq('uuid', uuidNotification);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async createNotification(body: any) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.notificationTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async deleteNotification(uuidNotification: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.notificationTableName)
      .delete()
      .eq('uuid', uuidNotification)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }
}
