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

export interface Root {
    content: TerrainResponse[]
    pageable: Pageable
    totalElements: number
    totalPages: number
    last: boolean
    size: number
    number: number
    sort: Sort
    numberOfElements: number
    first: boolean
    empty: boolean
  }
  
export interface TerrainResponse {
    id: number
    area: string
    soilType: string
    plantType: string
    photo: string
    email: string
    remainingDays: number
    forSale: boolean
    fullName: string
}

export interface Pageable {
    pageNumber: number
    pageSize: number
    sort: Sort
    offset: number
    unpaged: boolean
    paged: boolean
}

export interface Sort {
    empty: boolean
    unsorted: boolean
    sorted: boolean
}
