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
}

export interface LoginUserCred {
  email: string;
  password: string;
}

export interface UserRegResponse {
  id: number;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  position: {
    longitude: string;
    latitude: string;
  };
  type: string;
  firstLineOfAddress: string;
  secondLineOfAddress: string;
  country: string;
  placeId: string;
  postCode: string;
  city: string;
  phone: string;
  crisis: number;
}

export interface UserRegData {
  user: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  };
  position: {
    longitude: string;
    latitude: string;
  };
  type: UserType;
  firstLineOfAddress: string;
  secondLineOfAddress: string;
  placeId: string;
  postCode: string;
  city: string;
  country: string;
  crisis: number;
  phone: string;
}
