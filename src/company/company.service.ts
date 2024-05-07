import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class CompanyService {
  private companyTableName = Constants.CORE_COMPANY_TABLE_NAME;
  private libraryTableName = Constants.CORE_LIBRARY_TABLE_NAME;
  private projectTableName = Constants.CORE_PROJECT_TABLE_NAME;
  private userTableName = Constants.CORE_USER_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
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

  async getCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .select(`*,created_by(name,lastName,uuid)`)
      .eq('uuid', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async getUserCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .select(`*`)
      .eq('core_company', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async getCountObjectLinkCompany(from: string, uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(from)
      .select('count', { count: 'exact' })
      .eq('core_company', uuidCompany);

    return { data, error };
  }

  async getStatistiqueCompany(uuidCompany: string) {
    try {
      const projectCptPromise = this.getCountObjectLinkCompany(
        this.projectTableName,
        uuidCompany,
      );
      const libraryCptPromise = this.getCountObjectLinkCompany(
        this.libraryTableName,
        uuidCompany,
      );

      const [projectCpt, libraryCpt] = await Promise.all([
        projectCptPromise,
        libraryCptPromise,
      ]);

      if (projectCpt.error) {
        throw new Error(projectCpt.error.message);
      }
      if (libraryCpt.error) {
        throw new Error(libraryCpt.error.message);
      }

      return {
        projectCpt: projectCpt.data[0].count,
        libraryCpt: libraryCpt.data[0].count,
      };
    } catch (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
  }

  async createCompany(body: any) {
    const uniqueString = this.generateUniqueString(10);

    body.code = uniqueString;
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    const { data: dataAuth } = await this.supabase.getClient().auth.getUser();

    const { error: errorUser } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update({ core_company: data[0].uuid })
      .eq('uuid', dataAuth.user.id);

    if (errorUser) {
      this.dbLogger.error(JSON.stringify(errorUser));
      throw new HttpException(errorUser.message, 500);
    }
    return data[0];
  }

  async joinCompany(codeCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .select()
      .eq('code', codeCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    const { data: dataAuth } = await this.supabase.getClient().auth.getUser();

    const { error: errorUser } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update({ core_company: data[0].uuid })
      .eq('uuid', dataAuth.user.id);

    if (errorUser) {
      this.dbLogger.error(JSON.stringify(errorUser));
      throw new HttpException(errorUser.message, 500);
    }
    return data[0];
  }

  async uploadLogoCompany(file: any, uuidCompany: string) {
    if (!file) throw new HttpException('File not found', 400);
    const url = await this.storageFirebase.uploadFile(
      file,
      'company/' + uuidCompany + '/logo',
    );

    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    return this.updateCompany(uuidCompany, { logo_url: url });
  }

  async updateCompany(uuidCompany: string, body: any) {
    body.updated_at = new Date();
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .update(body)
      .eq('uuid', uuidCompany)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async updateCodeCompany(uuidCompany: string, body: any) {
    body.updated_at = new Date();
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .update({ code: body.code })
      .eq('uuid', uuidCompany)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return { code: data[0].code };
  }

  async deleteCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.companyTableName)
      .delete()
      .eq('uuid', uuidCompany)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }
}
