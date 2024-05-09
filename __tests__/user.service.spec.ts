import { DatabaseLogger } from '../src/supabase/supabase.logger';
import { UserService } from '../src/user/user.service';
import { FirebaseService } from '../src/firebase/firebase.service';
import { Supabase } from '../src/supabase/supabase';
import { Constants } from '../src/utils/Constants';

describe('UserService', () => {
  let userService: UserService;
  let supabaseMock: jest.Mocked<Supabase>;
  let dbLoggerMock: jest.Mocked<DatabaseLogger>;
  let firebaseServiceMock: jest.Mocked<FirebaseService>;

  beforeEach(() => {
    supabaseMock = {} as jest.Mocked<Supabase>;
    dbLoggerMock = {} as jest.Mocked<DatabaseLogger>;
    firebaseServiceMock = {} as jest.Mocked<FirebaseService>;

    userService = new UserService(
      supabaseMock,
      dbLoggerMock,
      firebaseServiceMock,
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should get user', async () => {
    supabaseMock.getClient = jest.fn().mockReturnValue({
      from: jest.fn().mockReturnThis(),
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
    });
    const uuidUser = 'c8128ed8-009f-4357-8c17-cb04cc96e343';

    const tmp = supabaseMock
      .getClient()
      .from(Constants.CORE_USER_TABLE_NAME)
      .select(`*`)
      .eq('uuid', uuidUser);

    const result = await userService.getUser(uuidUser);
    expect(result).toEqual(tmp[0]);
  });
});
