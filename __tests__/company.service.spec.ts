import { HttpException } from '@nestjs/common';
import { DatabaseLogger } from '../src/supabase/supabase.logger';
import { FirebaseService } from '../src/firebase/firebase.service';
import { Supabase } from '../src/supabase/supabase';
import { CompanyService } from '../src/company/company.service';

describe('CompanyService', () => {
  let companyService: CompanyService;
  let supabaseMock: jest.Mocked<Supabase>;
  let dbLoggerMock: jest.Mocked<DatabaseLogger>;
  let firebaseServiceMock: jest.Mocked<FirebaseService>;

  beforeEach(() => {
    supabaseMock = {} as jest.Mocked<Supabase>;
    dbLoggerMock = {} as jest.Mocked<DatabaseLogger>;
    firebaseServiceMock = {} as jest.Mocked<FirebaseService>;

    companyService = new CompanyService(
      supabaseMock,
      dbLoggerMock,
      firebaseServiceMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get company', async () => {
    const companyData = { uuid: 'test', name: 'Test Company' };
    supabaseMock.getClient = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });
    supabaseMock
      .getClient()
      .from()
      .select()
      .eq.mockResolvedValueOnce({ data: [companyData] });

    companyService.getStatistiqueCompany = jest
      .fn()
      .mockResolvedValueOnce({ projectCpt: 1, libraryCpt: 2 });

    const result = await companyService.getCompany('test');
    expect(result).toEqual({
      ...companyData,
      stats: { projectCpt: 1, libraryCpt: 2 },
    });
  });

  it('should throw HttpException if getCompany fails', async () => {
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

    await expect(companyService.getCompany('test')).rejects.toThrowError(
      HttpException,
    );
    expect(dbLoggerMock.error).toHaveBeenCalledWith(
      JSON.stringify({ message: errorMessage }),
    );
  });
});
