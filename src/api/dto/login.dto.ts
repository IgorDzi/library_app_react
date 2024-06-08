export class LoginDto{
  username: string | undefined;
  password: string | undefined;
}

export class LoginResponseDto {
  token: string | undefined;
}