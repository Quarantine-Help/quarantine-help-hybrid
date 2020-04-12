export interface LoginUserCred {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  participantId: number;
  email: string;
}