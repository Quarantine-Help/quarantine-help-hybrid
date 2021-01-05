export enum Crisis {
  COVID19 = 1,
}

export enum StorageKeys {
  hasUserOnboarded = 'hasUserOnboarded',
  authInfo = 'authInfo',
}

export enum RequestStatus {
  pending = 'P',
  transit = 'T',
  finished = 'F',
  cancelled = 'C',
}

export const defaultUserType = 'AF';
export const defaultPrimaryColor = 'primaryAF';
