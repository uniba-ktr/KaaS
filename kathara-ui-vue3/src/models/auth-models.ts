export interface IAuthToken {
  access_token: string | null;
  refresh_token: string | null;
}

export interface IUserProfile {
  user_id: string;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  disabled: boolean;
}

export interface IAuthRequestPayload {
  username: string;
  password: string;
}
