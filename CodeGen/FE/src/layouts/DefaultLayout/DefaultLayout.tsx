import Header from '@coreui/react/lib/Header';
import NavbarBrand from '@coreui/react/lib/NavbarBrand';
import Sidebar from '@coreui/react/lib/Sidebar';
import SidebarNav from '@coreui/react/lib/SidebarNav';
import SidebarToggler from '@coreui/react/lib/SidebarToggler';
import { menu } from 'config/menu';
import { LOGIN_ROUTE } from 'config/route-consts';
import { GlobalState } from 'core/config';
import { join } from 'path';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Switch, useHistory, withRouter } from 'react-router';
import {
  renderRoutes,
  RouteConfig,
  RouteConfigComponentProps,
} from 'react-router-config';
import * as router from 'react-router-dom';
import { useGlobal } from 'reactn';
import './DefaultLayout.scss';
import * as Cookie from 'js-cookie';
import authenticationService from 'services/AuthenticationService';

interface NavbarBrandLogoProps {
  src: string;

  width?: number;

  height?: number;

  alt?: string;
}

const navbarBrandFull: NavbarBrandLogoProps = {
  src: '/assets/img/brand/rang-dong.png',
  width: 120,
  height: 30,
};

const navbarBrandMinimized: NavbarBrandLogoProps = {
  src: '/assets/img/brand/rang-dong-minimized.png',
  width: 30,
  height: 30,
};

function translateMenu(menu: RouteConfig, translate: (str: string) => string) {
  return menu.map((route: RouteConfig) => {
    if (route?.children instanceof Array) {
      route.children = translateMenu(route.children, translate);
    }
    route.name = translate(route.name);
    return route;
  });
}

function DefaultLayout(props: RouteConfigComponentProps) {
  const history = useHistory();
  const { route, location } = props;
  const [translate] = useTranslation();
  const [user] = useGlobal<GlobalState>('user');

  const translatedMenu = React.useMemo(() => {
    return {
      items: translateMenu(menu, translate),
    };
  }, [translate]);

  React.useEffect(() => {
    if (!user) {
      if (!Cookie.get('Token')) {
        history.push(join(LOGIN_ROUTE), location);
      } else {
        authenticationService.checkAuth();
      }
    }
  }, [user, history, location]);

  return (
    <div className="app">
      <Header fixed className="navbar">
        <NavbarBrand full={navbarBrandFull} minimized={navbarBrandMinimized} />
        <SidebarToggler className="d-md-down-none" display="lg" />
      </Header>
      <div className="app-body">
        {/* <DefaultSidebar /> */}
        <Sidebar fixed display="lg">
          <SidebarNav navConfig={translatedMenu} {...props} router={router} />
        </Sidebar>
        <main className="main">
          <div className="app-content">
            <Switch>
              {route?.routes instanceof Array && renderRoutes(route.routes)}
            </Switch>
          </div>
        </main>
      </div>
    </div>
  );
}

export default withRouter(DefaultLayout);
