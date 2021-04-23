import { translate } from 'core/helpers/internationalization';
import { RouteConfig } from 'react-router-config';
import { APP_USER_ROUTE, STORE_ROUTE, ORGANIZATION_ROUTE, WAREHOUSE_ROUTE, INDIRECT_SALES_ORDER_ROUTE, E_ROUTE_ROUTE  } from 'config/route-consts';
import { BRAND_ROUTE } from 'config/route-consts';
import { DISTRICT_ROUTE } from 'config/route-consts';

import { PRODUCT_ROUTE } from 'config/route-consts';

import { PRODUCT_GROUPING_ROUTE } from 'config/route-consts';

import { PRODUCT_TYPE_ROUTE } from 'config/route-consts';

import { PROVINCE_ROUTE } from 'config/route-consts';

import { ROLE_ROUTE } from 'config/route-consts';

import { SUPPLIER_ROUTE } from 'config/route-consts';

import { UNIT_OF_MEASURE_ROUTE } from 'config/route-consts';

import { UNIT_OF_MEASURE_GROUPING_ROUTE } from 'config/route-consts';

import { WARD_ROUTE } from 'config/route-consts';

import { STORE_TYPE_ROUTE } from 'config/route-consts';

import { STORE_GROUPING_ROUTE } from 'config/route-consts';

export const menu: RouteConfig[] = [
  {
    name: translate('menu.dashboard'),
    url: '/dashboard',
    icon: 'fa fa-pie-chart',
  },
  {
    title: true,
    name: translate('menu.category'),
    wrapper: {            // optional wrapper object
      element: '',        // required valid HTML5 element tag
      attributes: {},        // optional valid JS object with JS API naming ex: { className: "my-class", style: { fontFamily: "Verdana" }, id: "my-id"}
    },
    class: '',             // optional class names space delimited list for title item ex: "text-center"
  },
  {
    name: translate('menu.masterData'),
    url: '/master-data',
    icon: 'fa fa-list-alt',
    children: [
      {
        name: translate('menu.products'),
        url: '/product',
        icon: 'fa fa-cubes',
        children: [
          {
            name: translate('menu.products'),
            url: PRODUCT_ROUTE,
          },
          {
            name: translate('menu.productGroupings'),
            url: PRODUCT_GROUPING_ROUTE,
          },
          {
            name: translate('menu.productTypes'),
            url: PRODUCT_TYPE_ROUTE,
          },

          {
            name: translate('menu.unitOfMeasures'),
            url: UNIT_OF_MEASURE_ROUTE,
          },
          {
            name: translate('menu.unitOfMeasureGroupings'),
            url: UNIT_OF_MEASURE_GROUPING_ROUTE,
          },
        ],
      },
      {
        name: translate('menu.partners'),
        url: '/partners',
        icon: 'fa fa-sign-language',
        children: [
          {
            name: translate('menu.suppliers'),
            url: SUPPLIER_ROUTE,
          },
          {
            name: translate('menu.brands'),
            url: BRAND_ROUTE,
          },
        ],
      },
      // {
      //   name: translate('menu.reseller'),
      //   url: '/reseller',
      //   icon: 'fa fa-circle',
      //   children: [
      //     {
      //       name: translate('menu.reseller'),
      //       url: '/reseller',
      //     },
      //     {
      //       name: translate('menu.resellerType'),
      //       url: '/reseller-type',
      //     },
      //   ],
      // },
      {
        name: translate('menu.store'),
        url: '/store',
        icon: 'fa fa-shopping-bag',
        children: [
          {
            name: translate('menu.stores'),
            url: STORE_ROUTE,
          },
          {
            name: translate('menu.storeTypes'),
            url: STORE_TYPE_ROUTE,
          },
          {
            name: translate('menu.storeGroupings'),
            url: STORE_GROUPING_ROUTE,
          },
        ],
      },
      {
        name: translate('menu.administrativeUnits'),
        url: '/provinces',
        icon: 'fa fa-map-signs',
        children: [
          {
            name: translate('menu.provinces'),
            url: PROVINCE_ROUTE,
          },
          {
            name: translate('menu.districts'),
            url: DISTRICT_ROUTE,
          },
          {
            name: translate('menu.wards'),
            url: WARD_ROUTE,
          },
        ],
      },
    ],
  },
  {
    title: true,
    name: translate('menu.system'),
  },
  {
    name: translate('menu.systemManagement'),
    url: '/system-management',
    icon: 'fa fa-cogs',
    children: [
      {
        name: translate('menu.appUsers'),
        url: APP_USER_ROUTE,
        icon: 'fa fa-user-plus',
      },
      {
        name: translate('menu.organization'),
        url: ORGANIZATION_ROUTE,
        icon: 'fa fa-sitemap',
      },
      {
        name: translate('menu.roles'),
        url: ROLE_ROUTE,
        icon: 'fa fa-users',
      },
    ],
  },
  {
    title: true,
    name: translate('menu.warehouses'),
  },
  {
    name: translate('menu.warehouse'),
    url: WAREHOUSE_ROUTE,
    icon: 'fa fa-cube',
  },
  {
    title: true,
    name: translate('menu.sales'),
  },
  {
    name: translate('menu.sales'),
    url: '/sales',
    icon: 'fa fa-shopping-cart',
    children: [
      {
        name: translate('menu.indirectSalesOrder'),
        url: INDIRECT_SALES_ORDER_ROUTE,
        icon: 'fa fa-long-arrow-right',
      },
      {
        name: translate('menu.directSalesOrder'),
        url: '/directSalesOrder',
        icon: 'fa fa-exchange',
      },
    ],
  },
  {
    name: translate('menu.discount'),
    url: '/discount',
    icon: 'fa fa-tags',
    children: [
      {
        name: translate('menu.priceList'),
        url: '/priceList',
        icon: 'fa fa-tag',
      },
      {
        name: translate('menu.promotion'),
        url: '/promotion',
        icon: 'fa fa-percent',
      },
    ],
  },
  {
    title: true,
    name: translate('menu.route'),
  },
  {
    name: translate('menu.routeMaster'),
    url: E_ROUTE_ROUTE,
    icon: 'fa fa-road',
  },
  {
    name: translate('menu.monitor'),
    url: '/monitor',
    icon: 'fa fa-street-view',
    children: [
      {
        name: translate('menu.salesmanMonitor'),
        url: '/salesmanMonitor',
        icon: 'fa fa-male',
      },
      {
        name: translate('menu.storeCheckerMonitor'),
        url: '/storeCheckerMonitor',
        icon: 'fa fa-paper-plane',
      },
      {
        name: translate('menu.storeImages'),
        url: '/storeImages',
        icon: 'fa fa-picture-o',
      },
    ],
  },
  {
    title: true,
    name: translate('menu.kpiManagement'),
  },
  {
    name: translate('menu.kpi'),
    url: '/kpi',
    icon: 'fa fa-line-chart ',
  },
  {
    title: true,
    name: translate('menu.notificationCenter'),
  },
  {
    name: translate('menu.notificationCenter'),
    url: '/notificationCenter',
    icon: 'fa fa-bell',
  },
  {
    title: true,
    name: translate('menu.report'),
  },
  {
    name: translate('menu.report'),
    url: '/report',
    icon: 'fa fa-area-chart ',
  },
];
