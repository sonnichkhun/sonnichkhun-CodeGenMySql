import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import ItemDetail from './ItemDetail/ItemDetail';
import ItemMaster from './ItemMaster/ItemMaster';

import './ItemView.scss';

function ItemView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { ItemMaster, ItemDetail };
export default withRouter(ItemView);
