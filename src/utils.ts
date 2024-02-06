import * as fs from 'fs';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

export class Utils {
  /**
   * Cette fonction permet de lire un fichier et de remplacer un placeholder dans ce fichier
   * Si insertPlaceHolder est à true, le placeholder est réinjecté à la fin
   * @param filePath
   * @param placeHolder
   * @param newValue
   * @param insertPlaceHolder
   */
  async readAndModify(
    filePath: string,
    placeHolder: string,
    newValue: string,
    insertPlaceHolder = true,
  ) {
    try {
      const fileContent = await fs.promises.readFile(filePath, 'utf-8');
      if (insertPlaceHolder) newValue += placeHolder;
      const updatedFileContent = fileContent.replace(
        new RegExp(placeHolder, 'g'),
        newValue,
      );
      await fs.promises.writeFile(filePath, updatedFileContent, 'utf-8');
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Cette fonction permet de capitalize une chaine de caractère
   * @param stringToCapitalize
   */
  capitalize(stringToCapitalize: string): string {
    if (stringToCapitalize.length === 0) return '';
    if (stringToCapitalize.length === 1)
      return stringToCapitalize.charAt(0).toUpperCase();
    return (
      stringToCapitalize.charAt(0).toUpperCase() +
      stringToCapitalize.slice(1).toLowerCase()
    );
  }

  /**
   * Cette fonction permet de convertir les codes d'erreur Supabase en code d'erreur HTTP
   * @param errorCode
   * @param message
   */
  public static convertSupabaseErrorToHttpError(
    errorCode: string,
    message?: string,
  ) {
    switch (errorCode) {
      case '42P01':
      case 'PGRST116':
        return new NotFoundException(message);
      default:
        return new InternalServerErrorException(message);
    }
  }
}
