export interface signUpDTO {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface signInDTO {
  email: string;
  password: string;
}
