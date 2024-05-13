import { HttpException, Injectable } from '@nestjs/common';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { Constants } from '../utils/Constants';
import { FirebaseService } from '../firebase/firebase.service';

@Injectable()
export class ProjectService {
  // Define table names using Constants enum
  private projectTableName = Constants.CORE_PROJECT_TABLE_NAME;
  private libraryTableName = Constants.CORE_LIBRARY_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly storageFirebase: FirebaseService,
  ) {}

  /**
   * Method to get a project by its UUID.
   * @param uuidProject The UUID of the project.
   * @returns The project object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async getProject(uuidProject: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*`)
      .eq('uuid', uuidProject);

    // Handle error if any
    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    // If no data found, throw 404 error
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    // Return the first item of the data array
    return data[0];
  }

  /**
   * Method to get projects by company UUID.
   * @param uuidCompany The UUID of the company.
   * @returns An array of projects.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async getProjectsByCompany(uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*`)
      .eq('core_company', uuidCompany)
      .order('updated_at', { ascending: false });

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  /**
   * Method to get projects by library UUID.
   * @param uuidLibrary The UUID of the library.
   * @returns An array of projects.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async getProjectByLibrary(uuidLibrary: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*,created_by(name,lastName,uuid),core_company(name,uuid)`)
      .eq('core_library', uuidLibrary)
      .order('updated_at', { ascending: false });

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }
    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data;
  }

  /**
   * Method to create a new project.
   * @param body The data for creating the project.
   * @returns The created project object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async createProject(body: any) {
    // TODO: Need core_company and core_library validation

    // Insert the project data into the database
    const { data, error } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .insert(body)
      .select();

    if (error) {
      this.dbLogger.error(JSON.stringify(error));
      throw new HttpException(error.message, 500);
    }

    // Fetch the count of projects associated with the library
    const { data: dataCount } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select('count', { count: 'exact' })
      .eq('core_library', body.core_library);

    // Update the project count in the library table
    await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .update({ project_count: dataCount[0].count })
      .eq('uuid', body.core_library);

    if (data.length === 0) throw new HttpException('Resource not found', 404);

    return data[0];
  }

  /**
   * Method to update an existing project.
   * @param uuidProject The UUID of the project to update.
   * @param body The updated data for the project.
   * @returns The updated project object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async updateProject(uuidProject: string, body: any) {
    // Set the updated_at field to the current date
    body.updated_at = new Date();

    // Update the project data in the database
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

  /**
   * Method to upload a logo for a project.
   * @param file The logo file to upload.
   * @param uuidProject The UUID of the project.
   * @returns The updated project object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async uploadLogoProject(file: any, uuidProject: string) {
    // Check if file exists
    if (!file) throw new HttpException('File not found', 400);

    // Upload the file to Firebase storage
    const url = await this.storageFirebase.uploadFile(
      file,
      'project/' + uuidProject,
    );

    // Handle errors during file upload
    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    // Update the project with the logo URL
    return this.updateProject(uuidProject, { logo_url: url });
  }

  // Method to upload an APK file for a project
  async uploadApkProject(file: any, uuidProject: string) {
    // Check if file exists
    if (!file) throw new HttpException('File not found', 400);

    // Upload the file to Firebase storage
    const url = await this.storageFirebase.uploadFile(
      file,
      'project/' + uuidProject,
    );

    // Handle errors during file upload
    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    // Update the project with the APK URL
    return this.updateProject(uuidProject, { apk_url: url });
  }

  // Method to upload an illustration for a project
  async uploadIllustration(file: any, uuidProject: string) {
    // Check if file exists
    if (!file) throw new HttpException('File not found', 400);

    // Upload the file to Firebase storage
    const url = await this.storageFirebase.uploadFile(
      file,
      'project/' + uuidProject + '/illustrations',
    );

    // Handle errors during file upload
    if (url === null) {
      this.dbLogger.error('Error uploading file logo company');
      throw new HttpException('Error uploading file logo company', 500);
    }

    // Return the URL of the uploaded illustration
    return { url: url.toString() };
  }

  // Method to upload multiple illustrations for a project
  async uploadIllustrations(files: any[], uuidProject: string) {
    // Check if files exist
    if (!files || files.length === 0) {
      throw new HttpException('Files not found', 400);
    }

    const urls: string[] = [];

    // Upload each file to Firebase storage and collect the URLs
    for (const file of files) {
      const url = await this.storageFirebase.uploadFile(
        file,
        'project/' + uuidProject + '/illustrations',
      );

      // Handle errors during file upload
      if (url === null) {
        this.dbLogger.error('Error uploading file logo company');
        throw new HttpException('Error uploading file logo company', 500);
      }

      urls.push(url.toString());
    }

    // Combine all the URLs into a single string
    const concatenatedUrls = urls.join(',');

    // Update the project with the URLs of the illustrations
    return this.updateProject(uuidProject, {
      illustrations_url: concatenatedUrls,
    });
  }

  /**
   * Method to delete a project.
   * @param uuidProject The UUID of the project to delete.
   * @returns The deleted project object.
   * @throws HttpException if an error occurs or if the resource is not found.
   */
  async deleteProject(uuidProject: string) {
    // Delete the project from the database
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
