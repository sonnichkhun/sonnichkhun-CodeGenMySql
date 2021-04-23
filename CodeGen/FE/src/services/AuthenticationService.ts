import { AxiosResponse } from 'axios';
import { API_PORTAL_ROUTE } from 'config/api-consts';
import { httpConfig } from 'config/http';
import { API_BASE_URL, GlobalState } from 'core/config';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import { AppUser } from 'models/AppUser';
import * as Cookie from 'js-cookie';
import { setGlobal } from 'reactn';

class AuthenticationService extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_PORTAL_ROUTE));
  }

  public checkAuth() {
    return this.http
      .post('profile/get')
      .then((response: AxiosResponse<AppUser>) => response.data)
      .then((user: AppUser) => {
        setGlobal<GlobalState>({
          user,
        });
      });
  }
  public login(appUser: AppUser) {
    return this.http
      .post('account/login', appUser)
      .then((response: AxiosResponse<AppUser>) => response.data);
  }

  public async logout() {
    Cookie.remove('Token');
    await setGlobal<GlobalState>({
      user: null,
    });
  }
}

export default new AuthenticationService();
