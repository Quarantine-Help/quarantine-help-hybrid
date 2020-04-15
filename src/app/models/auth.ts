export interface LoginUserCred {
  email: string;
  password: string;
}

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
