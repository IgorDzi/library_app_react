import axios, { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import { LoginDto, LoginResponseDto } from './dto/login.dto';
import { CreateBookDto, CreateBookResponseDto, GetAllBooksDto, GetBookDto } from './dto/books.dto';
import { BeginLoanDto, BeginLoanResponseDto, GetAllLoansDto, GetLoanDto } from './dto/loans.dto';
import { GetUserDto, RegisterDto, UpdatePasswordDto, UpdatePasswordResponseDto } from './dto/user.dto';

export type ClientResponse<T> = {
  success: boolean;
  data: T;
  statusCode: number;
}



export class LibraryClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: 'http://localhost:8081/api',
    });
  }


  public async login(data: LoginDto): Promise<ClientResponse<LoginResponseDto | null>> {
    try {
      const response: AxiosResponse<LoginResponseDto> = await this.client.post('/auth/login', data);
      this.client.defaults.headers.common['Authorization'] = 'Bearer ' + response.data.token;
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0
      }
    }
  }

  public async getBooks(): Promise<ClientResponse<GetAllBooksDto | null>> {
    try {
      const response = await this.client.get('/books');
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      }
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0
      };
    }
  }

  public async getLoans(): Promise<ClientResponse<GetAllLoansDto | null>> {
    try {
      const roleResponse = await this.getUserRole();
      const role = roleResponse.data;

      let response: AxiosResponse<GetAllLoansDto>;
      if (role === 'ROLE_ADMIN') {
        response = await this.client.get('/loans');
      } else {
        response = await this.client.get('/loans/me');
      }

      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }


  public async getUser(id: number): Promise<ClientResponse<GetUserDto | null>> {
    try {
      const response: AxiosResponse<GetUserDto> = await this.client.get(`/users/${id}`);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUsers(): Promise<ClientResponse<GetUserDto[] | null>> {
    try {
      const response: AxiosResponse<GetUserDto[]> = await this.client.get(`/users`);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getBook(id: number): Promise<ClientResponse<GetBookDto | null>> {
    try {
      const response: AxiosResponse<GetBookDto> = await this.client.get(`/books/${id}`);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async createBook(data: CreateBookDto): Promise<ClientResponse<CreateBookResponseDto | null>> {
    try {
      const response: AxiosResponse<CreateBookResponseDto> = await this.client.post('/books', data);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUserRole(): Promise<ClientResponse<string | null>> {
    try {
      const response: AxiosResponse<string> = await this.client.get('/auth/get-role');
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUsername(id: number): Promise<ClientResponse<string | null>> {
    try {
      const response: AxiosResponse<string> = await this.client.get(`/auth/get-username?id=${id}`);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async getUserRoleById(id: number): Promise<ClientResponse<string | null>> {
    try {
      const response: AxiosResponse<string> = await this.client.get(`/auth/get-role-by-id?id=${id}`);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }


  public async beginLoan(data: BeginLoanDto): Promise<ClientResponse<BeginLoanResponseDto | null>> {
    try {
      const response: AxiosResponse<BeginLoanResponseDto> = await this.client.post('/loans', data);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      console.error('API error:', axiosError);
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }


  public async endLoan(id: number): Promise<ClientResponse<GetLoanDto | null>> {
    try {
      const response: AxiosResponse<GetLoanDto> = await this.client.put(`/loans/${id}`);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async addUser(data: RegisterDto): Promise<ClientResponse<GetUserDto | null>> {
    try {
      const response: AxiosResponse<GetUserDto> = await this.client.post('/auth/register', data);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }

  public async updatePassword(data: UpdatePasswordDto): Promise<ClientResponse<UpdatePasswordResponseDto | null>> {
    try {
      const response: AxiosResponse<UpdatePasswordResponseDto> = await this.client.post('/auth/update-password', data);
      return {
        success: true,
        data: response.data,
        statusCode: response.status,
      };
    } catch (error) {
      const axiosError = error as AxiosError<Error>;
      return {
        success: false,
        data: null,
        statusCode: axiosError.response?.status || 0,
      };
    }
  }


}


