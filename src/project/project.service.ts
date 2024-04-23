import { HttpException, Injectable } from '@nestjs/common';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { Constants } from '../utils/Constants';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ProjectService {
  private projectTableName = Constants.CORE_PROJECT_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
  ) {}

  async getProject(uuidProject: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*`)
      .eq('uuid', uuidProject);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async getProjectsByCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*`)
      .eq('core_company', uuidCompany);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async getProjectByLibrary(uuidLibrary: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*,created_by(name,lastName,uuid),core_company(name,uuid)`)
      .eq('core_library', uuidLibrary);

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  async createProject(body: any) {
    //TODO need core_company and core_library validation
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async updateProject(uuidProject: string, body: any) {
    body.updated_at = new Date();
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .update(body)
      .eq('uuid', uuidProject)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  async uploadLogoProject(file: any, uuidProject: string) {
    if (!file) throw new HttpException('File not found', 400);
    const url = await this.storageFirebase.uploadFile(
      file,
      'project/' + uuidProject + '/logo',
    );

    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    return this.updateProject(uuidProject, { logo_url: url });
  }

  async deleteProject(uuidProject: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .delete()
      .eq('uuid', uuidProject)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }
}
