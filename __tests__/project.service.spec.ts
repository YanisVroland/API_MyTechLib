import { HttpException } from '@nestjs/common';
import { DatabaseLogger } from '../src/supabase/supabase.logger';
import { ProjectService } from '../src/project/project.service';
import { FirebaseService } from '../src/firebase/firebase.service';
import { Supabase } from '../src/supabase/supabase';

describe('ProjectService', () => {
  let projectService: ProjectService;
  let supabaseMock: jest.Mocked<Supabase>;
  let dbLoggerMock: jest.Mocked<DatabaseLogger>;
  let firebaseServiceMock: jest.Mocked<FirebaseService>;

  beforeEach(() => {
    supabaseMock = {} as jest.Mocked<Supabase>;
    dbLoggerMock = {} as jest.Mocked<DatabaseLogger>;
    firebaseServiceMock = {} as jest.Mocked<FirebaseService>;

    projectService = new ProjectService(
      supabaseMock,
      dbLoggerMock,
      firebaseServiceMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get project', async () => {
    const projectData = { uuid: 'test', name: 'Test Project' };
    supabaseMock.getClient = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });
    supabaseMock
      .getClient()
      .from()
      .select()
      .eq.mockResolvedValueOnce({ data: [projectData] });

    const result = await projectService.getProject('test');
    expect(result).toEqual(projectData);
  });

  it('should throw HttpException if getProject fails', async () => {
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

    await expect(projectService.getProject('test')).rejects.toThrowError(
      HttpException,
    );
    expect(dbLoggerMock.error).toHaveBeenCalledWith(
      JSON.stringify({ message: errorMessage }),
    );
  });
});
