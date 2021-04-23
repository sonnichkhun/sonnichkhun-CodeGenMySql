import { Card, Col, Row } from 'antd';
import React from 'react';
import { Route, Switch } from 'react-router';
import { RouteConfigComponentProps } from 'react-router-config';
import Map from 'components/GoogleAutoCompleteMap/GoogleAutoCompleteMap';
import { Store } from 'models/Store';
import { storeRepository } from 'views/StoreView/StoreRepository';
import { crudService } from 'core/services';
import FormItem from 'antd/lib/form/FormItem';
import { eRouteRepository } from 'views/ERouteView/ERouteRepository';
import { ERoute } from 'models/ERoute';

function ATestMapView(props: RouteConfigComponentProps) {
  // Hooks, useDetail, useChangeHandler
  const [store, setStore] = crudService.useDetail(
    Store,
    storeRepository.get,
    storeRepository.save,
  );

  const [eRouter] = crudService.useDetail(
    ERoute,
    eRouteRepository.get,
    eRouteRepository.save,
  );
  // React.useEffect(() => {
  //   Object.keys(store).map((key) => {
  //     if (key === 'address' || key === 'latitude' || key === 'longitude') {
  //       console.log(`store ${key}: ${store[key]}`);
  //     }
  //   });
  // }, [store]);

  return (
    <Switch>
      <Route path={props.route.path}>
        <Card>
          {JSON.stringify(eRouter)}
          <Row>
            <Col lg={12}>
              <FormItem>
                <div style={{ height: 300 }} className="mt-4">
                  <Map
                    lat={21.027763}
                    lng={105.83416}
                    defaultZoom={10}
                    defaultAddress={'Hà Nội'}
                    inputClassName={'form-control form-control-sm mb-4'}
                    inputMapClassName={'mt-4'}
                    model={store}
                    setModel={setStore}
                    isAddress={false}
                  />
                </div>
              </FormItem>
            </Col>
          </Row>
        </Card>
      </Route>
    </Switch>
  );
}

export default ATestMapView;
