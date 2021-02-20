import { UserType } from './core-api';

export interface LoginResponse {
  headers: {
    normalizedNames?: any;
    lazyUpdate?: any;
  };
  status: number;
  statusText: string;
  url: string;
  ok: boolean;
  type: number;
  body: LoginRespBody;
}

interface LoginRespBody {
  token: string;
  participantId: number;
  email: string;
  participantType: UserType;
}

export interface LoginUserCred {
  email: string;
  password: string;
}

export interface UserRegResponse {
  id: number;
  user: {
    fullName: string;
    email: string;
    password: string;
  };
  position: {
    longitude: string;
    latitude: string;
  };
  type: UserType;
  firstLineOfAddress?: string;
  secondLineOfAddress?: string;
  placeId?: string;
  postCode?: string;
  city: string;
  country: string;
  phone: string;
  crisis: number;
}

export interface UserRegData {
  user: {
    fullName: string;
    email: string;
    password: string;
  };
  type: UserType;
  crisis: number;
  phone: string;
  position: {
    longitude: string;
    latitude: string;
  };
  firstLineOfAddress?: string;
  secondLineOfAddress?: string;
  placeId?: string;
  postCode?: string;
  city: string;
  country: string;
}

export interface UserDataObservableType {
  email: string;
  token: string;
  type: UserType;
}
