import { HttpException, Injectable } from '@nestjs/common';
import { Constants } from '../utils/Constants';
import { Supabase } from '../supabase/supabase';
import { DatabaseLogger } from '../supabase/supabase.logger';
import { LibraryService } from '../library/library.service';
import { ProjectService } from '../project/project.service';

@Injectable()
export class CopyService {
  private copyTableName = Constants.COPY_LIBRARY_TABLE_NAME;
  private libraryTableName = Constants.CORE_LIBRARY_TABLE_NAME;
  private projectTableName = Constants.CORE_PROJECT_TABLE_NAME;

  constructor(
    private readonly supabase: Supabase,
    private readonly dbLogger: DatabaseLogger,
    private readonly libraryService: LibraryService,
    private readonly projectService: ProjectService,
  ) {}

  /**
   * Generates a unique string of a given length.
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
   * Creates a copy of the library with a unique code.
   * @param uuidLibrary The UUID of the library to be copied.
   * @returns The created copy of the library.
   */
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

  /**
   * Uses a copy of the library with the provided code.
   * @param codeStr The code of the library copy to be used.
   * @returns The copied library or an error if the operation fails.
   */
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
    if (!data || data.length == 0)
      throw new HttpException('Code not found', 404);

    if (data[0].ended_at < new Date())
      throw new HttpException('Code expired', 400);

    const { data: dataLib, error: errorLib } = await this.supabase
      .getClient()
      .from(this.libraryTableName)
      .select(`*`)
      .eq('uuid', data[0].core_library);

    if (errorLib) {
      this.dbLogger.error(JSON.stringify(errorLib));
      return errorLib;
    }

    if (!dataLib || dataLib.length == 0)
      throw new HttpException('Library not found', 404);

    const { data: dataAuth, error: errorAuth } = await this.supabase
      .getClient()
      .auth.getUser();

    if (errorAuth) {
      this.dbLogger.error(JSON.stringify(errorAuth));
      return errorAuth;
    }

    const library = await this.libraryService.createLibrary({
      name: dataLib[0].name,
      description: dataLib[0].description,
      belongs_to: dataAuth.user.id,
      created_at: new Date(),
      updated_at: new Date(),
      created_by: dataAuth.user.id,
      is_personal: true,
      logo_url: dataLib[0].logo_url,
      banner_url: dataLib[0].banner_url,
      project_count: dataLib[0].project_count,
      is_copy: true,
    });

    const { data: dataProjects, error: errorProjects } = await this.supabase
      .getClient()
      .from(this.projectTableName)
      .select(`*`)
      .eq('core_library', data[0].core_library);

    if (errorProjects) {
      this.dbLogger.error(JSON.stringify(errorProjects));
      return errorProjects;
    }

    if (dataProjects && dataProjects.length > 0) {
      for (let i = 0; i < dataProjects.length; i++) {
        const data = dataProjects[i];
        delete data.uuid;
        delete data.core_company;
        data.core_library = library.uuid;
        data.is_copy = true;
        data.is_personal = true;
        data.created_at = new Date();
        data.updated_at = new Date();
        data.created_by = dataAuth.user.id;

        const { error: errorProject } =
          await this.projectService.createProject(data);

        if (errorProject) {
          this.dbLogger.error(JSON.stringify(errorProject));
          return errorProject;
        }
      }
    }
    return library;
  }
}
