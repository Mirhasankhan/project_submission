export interface IRegisterPayload {
  fullName: string;
  email: string;
  password: string;
  
}

export interface ILoginPayload {
  email: string;
  password: string;
}
