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

export interface BackendError {
    message: string;
}

export interface AuthState {
    token: string | null;
    status: 'idle' | 'loading' | 'failed';
    error: string | null | undefined;
}
  