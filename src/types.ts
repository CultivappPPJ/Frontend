export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
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
  firstName: string;
  lastName: string;
}

export interface Root {
  content: TerrainResponse[]
  pageNumber: number
  pageSize: number
  totalElements: number
  totalPages: number
  last: boolean
}
  
export interface TerrainResponse {
  id: number
  name: string
  area: string
  soilType: string
  photo: string
  location: string
  email: string
  fullName: string
  crops: Crop[]
}

export interface Crop {
  id: number
  seedType: SeedType
  area: string
  photo: string
  harvestDate: string
  forSale: boolean
}

export interface SeedType {
  id: number
  name: string
}

export interface IFormInput {
  name: string;
  area: number;
  seedTypeIds: number[];
  photo: string;
  email: string;
  remainingDays: string;
  forSale: boolean;
  fullName: string;
  soilType: "Arenoso" | "Mixto" | "Ácido" | "Calizo" | "Supresivo";
  location: string;
}

export interface IFormCrop{
  seedTypeId: number;
  area: number;
  photo: string;
  harvestDate: string;
  forSale: boolean;
  terrainId: number;
}