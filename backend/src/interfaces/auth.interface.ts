export interface AuthResponse {
  message: string;
  status: boolean;
  email?: string;
}

export interface SignInResponse extends AuthResponse {
  accessToken?: string;
  refreshToken?: string;
}
