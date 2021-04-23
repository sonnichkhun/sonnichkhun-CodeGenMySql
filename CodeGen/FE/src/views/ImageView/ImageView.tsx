import React from 'react';
import {renderRoutes, RouteConfigComponentProps} from 'react-router-config';
import {Switch, withRouter} from 'react-router-dom';
import ImageDetail from './ImageDetail/ImageDetail';
import ImageMaster from './ImageMaster/ImageMaster';

import './ImageView.scss';

function ImageView(props: RouteConfigComponentProps) {
  const {route} = props;

  return (
    <Switch>
      {route && renderRoutes(route.children)}
    </Switch>
  );
}

export { ImageMaster, ImageDetail };
export default withRouter(ImageView);
