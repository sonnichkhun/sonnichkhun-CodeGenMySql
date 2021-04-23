import { AppUser } from 'models/AppUser';

export interface GlobalState {
  loading: boolean;

  language: string;

  fallbackLanguage: string;
  user?: AppUser;
}

export const initialGlobalState: GlobalState = {
  loading: false,
  language: 'vi',
  fallbackLanguage: 'vi',
  user: null,
};
