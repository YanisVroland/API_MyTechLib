import { HttpException } from '@nestjs/common';
import { DatabaseLogger } from '../src/supabase/supabase.logger';
import { InformationService } from '../src/information/information.service';
import { Supabase } from '../src/supabase/supabase';

describe('InformationService', () => {
  let informationService: InformationService;
  let supabaseMock: jest.Mocked<Supabase>;
  let dbLoggerMock: jest.Mocked<DatabaseLogger>;

  beforeEach(() => {
    supabaseMock = {} as jest.Mocked<Supabase>;
    dbLoggerMock = {} as jest.Mocked<DatabaseLogger>;

    informationService = new InformationService(supabaseMock, dbLoggerMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get information by company', async () => {
    const informationData = [{ uuid: 'test', title: 'Test Information' }];
    supabaseMock.getClient = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      order: jest.fn().mockReturnThis(),
    });
    supabaseMock
      .getClient()
      .from()
      .select()
      .eq()
      .order()
      .mockResolvedValueOnce({ data: informationData });

    const result = await informationService.getInformationByCompany('test');
    expect(result).toEqual(informationData);
  });

  it('should throw HttpException if getInformationByCompany fails', async () => {
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
      .eq()
      .mockResolvedValueOnce({ error: { message: errorMessage } });

    await expect(
      informationService.getInformationByCompany('test'),
    ).rejects.toThrowError(HttpException);
    expect(dbLoggerMock.error).toHaveBeenCalledWith(
      JSON.stringify({ message: errorMessage }),
    );
  });
});
