import { HttpException } from '@nestjs/common';
import { DatabaseLogger } from '../src/supabase/supabase.logger';
import { FirebaseService } from '../src/firebase/firebase.service';
import { ProjectService } from '../src/project/project.service';
import { Supabase } from '../src/supabase/supabase';
import { LibraryService } from '../src/library/library.service';

describe('LibraryService', () => {
  let libraryService: LibraryService;
  let supabaseMock: jest.Mocked<Supabase>;
  let dbLoggerMock: jest.Mocked<DatabaseLogger>;
  let firebaseServiceMock: jest.Mocked<FirebaseService>;
  let projectServiceMock: jest.Mocked<ProjectService>;

  beforeEach(() => {
    supabaseMock = {} as jest.Mocked<Supabase>;
    dbLoggerMock = {} as jest.Mocked<DatabaseLogger>;
    firebaseServiceMock = {} as jest.Mocked<FirebaseService>;
    projectServiceMock = {} as jest.Mocked<ProjectService>;

    libraryService = new LibraryService(
      supabaseMock,
      dbLoggerMock,
      firebaseServiceMock,
      projectServiceMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get library', async () => {
    const libraryData = { uuid: 'test', name: 'Test Library' };
    supabaseMock.getClient = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });
    supabaseMock
      .getClient()
      .from()
      .select()
      .eq.mockResolvedValueOnce({ data: [libraryData] });

    const result = await libraryService.getLibrary('test');
    expect(result).toEqual(libraryData);
  });

  it('should throw HttpException if getLibrary fails', async () => {
    supabaseMock.getClient = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });
    const errorMessage = 'Error message from Supabase';
    supabaseMock
      .getClient()
      .from()
      .select()
      .eq.mockResolvedValueOnce({ error: { message: errorMessage } });

    await expect(libraryService.getLibrary('test')).rejects.toThrowError(
      HttpException,
    );
    expect(dbLoggerMock.error).toHaveBeenCalledWith(
      JSON.stringify({ message: errorMessage }),
    );
  });
});
