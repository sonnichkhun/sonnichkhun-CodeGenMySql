import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import VariationDetail from './VariationDetail/VariationDetail';
import VariationMaster from './VariationMaster/VariationMaster';

import './VariationView.scss';

function VariationView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { VariationMaster, VariationDetail };
export default withRouter(VariationView);
