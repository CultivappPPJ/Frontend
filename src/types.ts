export interface SignInData {
    email: string;
    password: string;
}
  
export interface SignInResponse {
    token: string;
}

export interface SignUpData {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email: string;
    password: string;
}

export interface SignUpResponse {
    token: string;
}
  