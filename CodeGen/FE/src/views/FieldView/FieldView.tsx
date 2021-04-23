import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import FieldDetail from './FieldDetail/FieldDetail';
import FieldMaster from './FieldMaster/FieldMaster';

import './FieldView.scss';

function FieldView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { FieldMaster, FieldDetail };
export default withRouter(FieldView);
