import { IRegisterRequest, ILoginRequest } from '@masar/types';

export class RegisterDto implements IRegisterRequest {
  email!: string;
  password!: string;
  name!: string;
}

export class LoginDto implements ILoginRequest {
  email!: string;
  password!: string;
}

export class RefreshTokenDto {
  refreshToken!: string;
}
