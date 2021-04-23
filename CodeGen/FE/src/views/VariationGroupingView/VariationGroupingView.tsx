import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import VariationGroupingDetail from './VariationGroupingDetail/VariationGroupingDetail';
import VariationGroupingMaster from './VariationGroupingMaster/VariationGroupingMaster';

import './VariationGroupingView.scss';

function VariationGroupingView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { VariationGroupingMaster, VariationGroupingDetail };
export default withRouter(VariationGroupingView);
