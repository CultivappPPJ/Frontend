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
  status: "idle" | "loading" | "failed";
  error: string | null | undefined;
}

export interface TokenPayload {
  sub: string;
}

/* export interface Terrain {
    name: string;
    area: string;
    soilType: string;
    saleType: string;
    image:undefined;
  } */

export interface Terrain {
  id: number;
  name: string;
  area: string;
  soilType: string;
  plantType: string;
  photo: string;
  email: string;
  remainingDays: number;
  forSale: boolean;
  fullName: string;
}
