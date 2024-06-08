export interface GetUserDto {
  id: number;
  fullName: string;
  email: string;
}


export interface RegisterDto {
  username: string;
  password: string;
  role: string;
  email: string;
  fullName: string;
}



export interface UpdatePasswordDto {
  username: string;
  password: string;
}

export interface UpdatePasswordResponseDto {
  username: string;
  success: boolean;
}

