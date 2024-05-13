import { HttpException, Injectable } from '@nestjs/common';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { Constants } from '../utils/Constants';
import { FirebaseService } from '../firebase/firebase.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class LibraryService {
  private libraryTableName = Constants.CORE_LIBRARY_TABLE_NAME;
  private projectTableName = Constants.CORE_PROJECT_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * Method to get a library by its UUID.
   * @param uuidLibrary The UUID of the library.
   * @returns The library object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
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

  /**
   * Method to get libraries by company UUID.
   * @param uuidCompany The UUID of the company.
   * @returns An array of libraries.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
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

  /**
   * Method to get libraries by user UUID.
   * @param uuidUser The UUID of the user.
   * @returns An array of libraries.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
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

  /**
   * Method to create a new library.
   * @param body The data for creating the library.
   * @returns The created library object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
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

  /**
   * Method to update an existing library.
   * @param uuidLibrary The UUID of the library to update.
   * @param body The updated data for the library.
   * @returns The updated library object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async updateLibrary(uuidLibrary: string, body: any) {
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

  /**
   * Method to update the project count in a library.
   * @param uuidLibrary The UUID of the library.
   * @returns The updated library object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
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

  /**
   * Method to delete a library.
   * @param uuidLibrary The UUID of the library to delete.
   * @returns The deleted library object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async deleteLibrary(uuidLibrary: string) {
    // Fetch all projects associated with the library
    const { data: dataProjects, error: errorProjects } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*`)
      .eq('core_library', uuidLibrary);
    if (errorProjects) {
      this.dbLogger.error(JSON.stringify(errorProjects));
      return errorProjects;
    }
    if (dataProjects && dataProjects.length > 0) {
      // Delete each project associated with the library
      for (const project of dataProjects) {
        await this.projectService.deleteProject(project.uuid);
      }
    }

    // Delete the library from the database
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

  /**
   * Method to upload a logo for a library.
   * @param file The logo file to upload.
   * @param uuidLibrary The UUID of the library.
   * @returns The updated library object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
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

    // Update the library with the logo URL
    return this.updateLibrary(uuidLibrary, { logo_url: url });
  }

  /**
   * Method to upload a banner for a library.
   * @param file The banner file to upload.
   * @param uuidLibrary The UUID of the library.
   * @returns The updated library object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
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

    // Update the library with the banner URL
    return this.updateLibrary(uuidLibrary, { banner_url: url });
  }
}
