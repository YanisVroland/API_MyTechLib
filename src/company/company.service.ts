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

  /**
   * Generate a unique string of a given length.
   * @param length The length of the unique string to be generated.
   * @returns A unique string of the specified length.
   */
  generateUniqueString(length: number): string {
    const characters =
      'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  /**
   * Retrieve company details by UUID.
   * @param uuidCompany The UUID of the company to retrieve.
   * @returns Company details along with statistics.
   * @throws HttpException if the company is not found.
   */
  async getCompany(uuidCompany: string) {
    // Retrieve company details
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

    // Retrieve company statistics
    const stats = await this.getStatistiqueCompany(uuidCompany);
    data[0].stats = stats;

    return data[0];
  }

  /**
   * Retrieve users belonging to a company.
   * @param uuidCompany The UUID of the company.
   * @returns Array of users belonging to the company.
   * @throws HttpException if no users are found.
   */
  async getUserCompany(uuidCompany: string) {
    // Retrieve users belonging to the company
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

  /**
   * Get the count of objects linked to the company from a specified table.
   * @param from The table name.
   * @param uuidCompany The UUID of the company.
   * @returns The count of objects linked to the company.
   */
  async getCountObjectLinkCompany(from: string, uuidCompany: string) {
    const { data, error } = await this.supabase
      .getClient()
      .from(from)
      .select('count', { count: 'exact' })
      .eq('core_company', uuidCompany);

    return { data, error };
  }

  /**
   * Get statistics related to the company, such as project and library counts.
   * @param uuidCompany The UUID of the company.
   * @returns Object containing project and library counts.
   * @throws HttpException if an error occurs while retrieving statistics.
   */
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

  /**
   * Create a new company.
   * @param body The company data to be inserted.
   * @returns The created company details.
   * @throws HttpException if an error occurs while creating the company.
   */
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

    // Assign the current user as company admin
    const { data: dataAuth } = await this.supabase.getClient().auth.getUser();

    const { error: errorUser } = await this.supabase
      .getClient()
      .from(this.userTableName)
      .update({ core_company: data[0].uuid, company_admin: true })
      .eq('uuid', dataAuth.user.id);

    if (errorUser) {
      this.dbLogger.error(JSON.stringify(errorUser));
      throw new HttpException(errorUser.message, 500);
    }
    return data[0];
  }

  /**
   * Join a company using a provided company code.
   * @param codeCompany The company code.
   * @returns The details of the joined company.
   * @throws HttpException if an error occurs while joining the company.
   */
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

    // Assign the current user to the joined company
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

  /**
   * Upload a company logo.
   * @param file The file containing the logo.
   * @param uuidCompany The UUID of the company.
   * @returns The updated company details with the logo URL.
   * @throws HttpException if an error occurs while uploading the logo.
   */
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

  /**
   * Update company details.
   * @param uuidCompany The UUID of the company to update.
   * @param body The updated company data.
   * @returns The updated company details.
   * @throws HttpException if an error occurs while updating the company.
   */
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

  /**
   * Update company code.
   * @param uuidCompany The UUID of the company to update.
   * @param body The updated company code.
   * @returns The updated company code.
   * @throws HttpException if an error occurs while updating the company code.
   */
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

  //TODO : delete all object link to company
  /**
   * Delete a company and all associated objects.
   * @param uuidCompany The UUID of the company to delete.
   * @returns The deleted company details.
   * @throws HttpException if an error occurs while deleting the company.
   */
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
