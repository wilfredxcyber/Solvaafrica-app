export interface UserProfile {
  fullName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  gender: string | null;
}
export interface ILoginForm {
  email: string;
  password: string;
}
export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface SavedFile {
  path: string;
  album: string;
}
