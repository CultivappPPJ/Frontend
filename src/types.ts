export interface SignInData {
    email: string;
    password: string;
}
  
export interface SignInResponse {
    token: string;
    username: string;
    email: string;
    rol: string;
}

export interface SignUpData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    token: string;
    username: string;
    email: string;
    rol: string;
}
  