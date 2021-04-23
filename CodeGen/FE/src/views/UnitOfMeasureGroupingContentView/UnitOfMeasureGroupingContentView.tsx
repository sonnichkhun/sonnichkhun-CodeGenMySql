import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import UnitOfMeasureGroupingContentDetail from './UnitOfMeasureGroupingContentDetail/UnitOfMeasureGroupingContentDetail';
import UnitOfMeasureGroupingContentMaster from './UnitOfMeasureGroupingContentMaster/UnitOfMeasureGroupingContentMaster';

import './UnitOfMeasureGroupingContentView.scss';

function UnitOfMeasureGroupingContentView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { UnitOfMeasureGroupingContentMaster, UnitOfMeasureGroupingContentDetail };
export default withRouter(UnitOfMeasureGroupingContentView);
