import { Test, TestingModule } from '@nestjs/testing';
import { HttpException } from '@nestjs/common';
import { SupabaseService } from '../src/supabase/supabase.service';
import { Supabase } from '../src/supabase/supabase';
import { DatabaseLogger } from '../src/supabase/supabase.logger';

const supabaseMock = {
  getClient: jest.fn().mockReturnValue({
    from: jest.fn().mockReturnThis(),
    select: jest.fn().mockReturnThis(),
  }),
};

const databaseLoggerMock = {
  error: jest.fn(),
};

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SupabaseService,
        { provide: Supabase, useValue: supabaseMock },
        { provide: DatabaseLogger, useValue: databaseLoggerMock },
      ],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService) as SupabaseService;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return "pong" when Supabase ping is successful', async () => {
    const result = await service.ping();
    expect(result).toEqual({ message: 'pong' });
    expect(supabaseMock.getClient().from).toHaveBeenCalledWith(
      'CORE_USER_TABLE_NAME',
    );
    expect(supabaseMock.getClient().from().select).toHaveBeenCalledWith('*');
  });

  it('should throw HttpException when Supabase ping fails', async () => {
    const errorMessage = 'Error message from Supabase';
    supabaseMock
      .getClient()
      .from()
      .select.mockResolvedValueOnce({ error: { message: errorMessage } });

    await expect(service.ping()).rejects.toThrowError(HttpException);
    expect(databaseLoggerMock.error).toHaveBeenCalledWith(
      JSON.stringify({ message: errorMessage }),
    );
  });
});
