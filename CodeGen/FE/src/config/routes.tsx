import Login from 'components/Login/Login';
import {
  APP_USER_ROUTE,
  BRAND_ROUTE,
  DISTRICT_ROUTE,
  FIELD_ROUTE,
  IMAGE_ROUTE,
  ITEM_ROUTE,
  MENU_ROUTE,
  ORGANIZATION_ROUTE,
  PAGE_ROUTE,
  PERMISSION_ROUTE,
  PRODUCT_GROUPING_ROUTE,
  PRODUCT_ROUTE,
  PRODUCT_TYPE_ROUTE,
  PROVINCE_ROUTE,
  ROLE_ROUTE,
  ROOT_ROUTE,
  STORE_GROUPING_ROUTE,
  STORE_ROUTE,
  STORE_TYPE_ROUTE,
  SUPPLIER_ROUTE,
  TAX_TYPE_ROUTE,
  UNIT_OF_MEASURE_GROUPING_CONTENT_ROUTE,
  UNIT_OF_MEASURE_GROUPING_ROUTE,
  UNIT_OF_MEASURE_ROUTE,
  VARIATION_GROUPING_ROUTE,
  VARIATION_ROUTE,
  WARD_ROUTE,
  WAREHOUSE_ROUTE,
  E_ROUTE_ROUTE,
  INDIRECT_SALES_ORDER_ROUTE,
} from 'config/route-consts';
import DefaultLayout from 'layouts/DefaultLayout/DefaultLayout';
import { join } from 'path';
import { RouteConfig } from 'react-router-config';
import AppUserView, {
  AppUserDetail,
  AppUserMaster,
} from 'views/AppUserView/AppUserView';
import BrandView, { BrandDetail, BrandMaster } from 'views/BrandView/BrandView';
import DistrictView, {
  DistrictDetail,
  DistrictMaster,
} from 'views/DistrictView/DistrictView';
import FieldView, { FieldDetail, FieldMaster } from 'views/FieldView/FieldView';
import ImageView, { ImageDetail, ImageMaster } from 'views/ImageView/ImageView';
import ItemView, { ItemDetail, ItemMaster } from 'views/ItemView/ItemView';
import MenuView, { MenuDetail, MenuMaster } from 'views/MenuView/MenuView';
import OrganizationTreeView, {
  OrganizationTreeDetail,
  OrganizationTreeMaster,
} from 'views/OrganizationTreeView/OrganizationTreeView';
import PageView, { PageDetail, PageMaster } from 'views/PageView/PageView';
import PermissionView, {
  PermissionDetail,
  PermissionMaster,
} from 'views/PermissionView/PermissionView';
import ProductGroupingTreeView, {
  ProductGroupingTreeDetail,
  ProductGroupingTreeMaster,
} from 'views/ProductGroupingTreeView/ProductGroupingTreeView';
import ProductTypeView, {
  ProductTypeDetail,
  ProductTypeMaster,
} from 'views/ProductTypeView/ProductTypeView';
import ProductView, {
  ProductDetail,
  ProductMaster,
} from 'views/ProductView/ProductView';
import ProvinceView, {
  ProvinceDetail,
  ProvinceMaster,
} from 'views/ProvinceView/ProvinceView';
import RoleView, {
  AppUserRoleDetail,
  PermissionRoleDetail,
  RoleMaster,
} from 'views/RoleView/RoleView';
import StoreGroupingTreeView, {
  StoreGroupingTreeDetail,
  StoreGroupingTreeMaster,
} from 'views/StoreGroupingTreeView/StoreGroupingTreeView';
import StoreTypeView, {
  StoreTypeDetail,
  StoreTypeMaster,
} from 'views/StoreTypeView/StoreTypeView';
import StoreView, { StoreDetail, StoreMaster } from 'views/StoreView/StoreView';
import SupplierView, {
  SupplierDetail,
  SupplierMaster,
} from 'views/SupplierView/SupplierView';
import TaxTypeView, {
  TaxTypeDetail,
  TaxTypeMaster,
} from 'views/TaxTypeView/TaxTypeView';
import UnitOfMeasureGroupingContentView, {
  UnitOfMeasureGroupingContentDetail,
  UnitOfMeasureGroupingContentMaster,
} from 'views/UnitOfMeasureGroupingContentView/UnitOfMeasureGroupingContentView';
import UnitOfMeasureGroupingView, {
  UnitOfMeasureGroupingDetail,
  UnitOfMeasureGroupingMaster,
} from 'views/UnitOfMeasureGroupingView/UnitOfMeasureGroupingView';
import UnitOfMeasureView, {
  UnitOfMeasureDetail,
  UnitOfMeasureMaster,
} from 'views/UnitOfMeasureView/UnitOfMeasureView';
import VariationGroupingView, {
  VariationGroupingDetail,
  VariationGroupingMaster,
} from 'views/VariationGroupingView/VariationGroupingView';
import VariationView, {
  VariationDetail,
  VariationMaster,
} from 'views/VariationView/VariationView';
import WardView, { WardDetail, WardMaster } from 'views/WardView/WardView';
import WarehouseView, {
  WarehouseDetail,
  WarehouseMaster,
} from 'views/WarehouseView/WarehouseView';
import IndirectSalesOrderView, { IndirectSalesOrderDetail, IndirectSalesOrderMaster } from 'views/IndirectSalesOrderView/IndirectSalesOrderView';

import ERouteView, {
  ERouteMaster,
  ERouteDetail,
}from 'views/ERouteView/ERouteView';
import ATestMapView from 'views/ATestMapView/ATestMapView';

export const routes: RouteConfig[] = [
  {
    key: 'login',
    path: join(ROOT_ROUTE, 'login'),
    component: Login,
    exact: true,
  },
  {
    key: 'main',
    path: ROOT_ROUTE,
    component: DefaultLayout,
    routes: [
      {
        path: APP_USER_ROUTE,
        component: AppUserView,
        children: [
          {
            path: join(APP_USER_ROUTE, ':id'),
            component: AppUserDetail,
          },
          {
            path: join(APP_USER_ROUTE),
            component: AppUserMaster,
          },
        ],
      },

      {
        path: BRAND_ROUTE,
        component: BrandView,
        children: [
          {
            path: join(BRAND_ROUTE, ':id'),
            component: BrandDetail,
          },
          {
            path: join(BRAND_ROUTE),
            component: BrandMaster,
          },
        ],
      },
      {
        path: SUPPLIER_ROUTE,
        component: SupplierView,
        children: [
          {
            path: join(SUPPLIER_ROUTE, ':id'),
            component: SupplierDetail,
          },
          {
            path: join(SUPPLIER_ROUTE),
            component: SupplierMaster,
          },
        ],
      },
      {
        path: DISTRICT_ROUTE,
        component: DistrictView,
        children: [
          {
            path: join(DISTRICT_ROUTE, ':id'),
            component: DistrictDetail,
          },
          {
            path: join(DISTRICT_ROUTE),
            component: DistrictMaster,
          },
        ],
      },
      {
        path: E_ROUTE_ROUTE,
        component: ERouteView,
        children:
        [
            {
                path: join(E_ROUTE_ROUTE, ':id'),
                component: ERouteDetail,
            },
            {
                path: join(E_ROUTE_ROUTE),
                component: ERouteMaster,
            },
        ],
    },

      {
        path: FIELD_ROUTE,
        component: FieldView,
        children: [
          {
            path: join(FIELD_ROUTE, ':id'),
            component: FieldDetail,
          },
          {
            path: join(FIELD_ROUTE),
            component: FieldMaster,
          },
        ],
      },

      {
        path: IMAGE_ROUTE,
        component: ImageView,
        children: [
          {
            path: join(IMAGE_ROUTE, ':id'),
            component: ImageDetail,
          },
          {
            path: join(IMAGE_ROUTE),
            component: ImageMaster,
          },
        ],
      },

      {
        path: ITEM_ROUTE,
        component: ItemView,
        children: [
          {
            path: join(ITEM_ROUTE, ':id'),
            component: ItemDetail,
          },
          {
            path: join(ITEM_ROUTE),
            component: ItemMaster,
          },
        ],
      },

      {
        path: MENU_ROUTE,
        component: MenuView,
        children: [
          {
            path: join(MENU_ROUTE, ':id'),
            component: MenuDetail,
          },
          {
            path: join(MENU_ROUTE),
            component: MenuMaster,
          },
        ],
      },
      {
        path: ORGANIZATION_ROUTE,
        component: OrganizationTreeView,
        children: [
          {
            path: join(ORGANIZATION_ROUTE, ':id'),
            component: OrganizationTreeDetail,
          },
          {
            path: join(ORGANIZATION_ROUTE),
            component: OrganizationTreeMaster,
          },
        ],
      },

      {
        path: PAGE_ROUTE,
        component: PageView,
        children: [
          {
            path: join(PAGE_ROUTE, ':id'),
            component: PageDetail,
          },
          {
            path: join(PAGE_ROUTE),
            component: PageMaster,
          },
        ],
      },

      {
        path: PERMISSION_ROUTE,
        component: PermissionView,
        children: [
          {
            path: join(PERMISSION_ROUTE, ':id'),
            component: PermissionDetail,
          },
          {
            path: join(PERMISSION_ROUTE),
            component: PermissionMaster,
          },
        ],
      },

      {
        path: PRODUCT_ROUTE,
        component: ProductView,
        children: [
          {
            path: join(PRODUCT_ROUTE, ':id'),
            component: ProductDetail,
          },
          {
            path: join(PRODUCT_ROUTE),
            component: ProductMaster,
          },
        ],
      },

      {
        path: PRODUCT_GROUPING_ROUTE,
        component: ProductGroupingTreeView,
        children: [
          {
            path: join(PRODUCT_GROUPING_ROUTE, ':id'),
            component: ProductGroupingTreeDetail,
          },
          {
            path: join(PRODUCT_GROUPING_ROUTE),
            component: ProductGroupingTreeMaster,
          },
        ],
      },

      {
        path: PRODUCT_TYPE_ROUTE,
        component: ProductTypeView,
        children: [
          {
            path: join(PRODUCT_TYPE_ROUTE, ':id'),
            component: ProductTypeDetail,
          },
          {
            path: join(PRODUCT_TYPE_ROUTE),
            component: ProductTypeMaster,
          },
        ],
      },

      {
        path: PROVINCE_ROUTE,
        component: ProvinceView,
        children: [
          {
            path: join(PROVINCE_ROUTE, ':id'),
            component: ProvinceDetail,
          },
          {
            path: join(PROVINCE_ROUTE),
            component: ProvinceMaster,
          },
        ],
      },
      {
        path: STORE_ROUTE,
        component: StoreView,
        children: [
          {
            path: join(STORE_ROUTE, ':id'),
            component: StoreDetail,
          },
          {
            path: join(STORE_ROUTE),
            component: StoreMaster,
          },
        ],
      },

      {
        path: STORE_TYPE_ROUTE,
        component: StoreTypeView,
        children: [
          {
            path: join(STORE_TYPE_ROUTE, ':id'),
            component: StoreTypeDetail,
          },
          {
            path: join(STORE_TYPE_ROUTE),
            component: StoreTypeMaster,
          },
        ],
      },

      {
        path: STORE_GROUPING_ROUTE,
        component: StoreGroupingTreeView,
        children: [
          {
            path: join(STORE_GROUPING_ROUTE, ':id'),
            component: StoreGroupingTreeDetail,
          },
          {
            path: join(STORE_GROUPING_ROUTE),
            component: StoreGroupingTreeMaster,
          },
        ],
      },

      {
        path: TAX_TYPE_ROUTE,
        component: TaxTypeView,
        children: [
          {
            path: join(TAX_TYPE_ROUTE, ':id'),
            component: TaxTypeDetail,
          },
          {
            path: join(TAX_TYPE_ROUTE),
            component: TaxTypeMaster,
          },
        ],
      },

      {
        path: UNIT_OF_MEASURE_ROUTE,
        component: UnitOfMeasureView,
        children: [
          {
            path: join(UNIT_OF_MEASURE_ROUTE, ':id'),
            component: UnitOfMeasureDetail,
          },
          {
            path: join(UNIT_OF_MEASURE_ROUTE),
            component: UnitOfMeasureMaster,
          },
        ],
      },

      {
        path: UNIT_OF_MEASURE_GROUPING_CONTENT_ROUTE,
        component: UnitOfMeasureGroupingContentView,
        children: [
          {
            path: join(UNIT_OF_MEASURE_GROUPING_CONTENT_ROUTE, ':id'),
            component: UnitOfMeasureGroupingContentDetail,
          },
          {
            path: join(UNIT_OF_MEASURE_GROUPING_CONTENT_ROUTE),
            component: UnitOfMeasureGroupingContentMaster,
          },
        ],
      },

      {
        path: UNIT_OF_MEASURE_GROUPING_ROUTE,
        component: UnitOfMeasureGroupingView,
        children: [
          {
            path: join(UNIT_OF_MEASURE_GROUPING_ROUTE, ':id'),
            component: UnitOfMeasureGroupingDetail,
          },
          {
            path: join(UNIT_OF_MEASURE_GROUPING_ROUTE),
            component: UnitOfMeasureGroupingMaster,
          },
        ],
      },

      {
        path: VARIATION_ROUTE,
        component: VariationView,
        children: [
          {
            path: join(VARIATION_ROUTE, ':id'),
            component: VariationDetail,
          },
          {
            path: join(VARIATION_ROUTE),
            component: VariationMaster,
          },
        ],
      },

      {
        path: VARIATION_GROUPING_ROUTE,
        component: VariationGroupingView,
        children: [
          {
            path: join(VARIATION_GROUPING_ROUTE, ':id'),
            component: VariationGroupingDetail,
          },
          {
            path: join(VARIATION_GROUPING_ROUTE),
            component: VariationGroupingMaster,
          },
        ],
      },
      {
        path: WARD_ROUTE,
        component: WardView,
        children: [
          {
            path: join(WARD_ROUTE, ':id'),
            component: WardDetail,
          },
          {
            path: join(WARD_ROUTE),
            component: WardMaster,
          },
        ],
      },
      {
        path: WAREHOUSE_ROUTE,
        component: WarehouseView,
        children: [
          {
            path: join(WAREHOUSE_ROUTE, ':id'),
            component: WarehouseDetail,
          },
          {
            path: join(WAREHOUSE_ROUTE),
            component: WarehouseMaster,
          },
        ],
      },
      {
        path: ROLE_ROUTE,
        component: RoleView,
        children: [
          {
            path: join(ROLE_ROUTE, 'assign-app-user/:id'),
            component: AppUserRoleDetail,
          },
          {
            path: join(ROLE_ROUTE, 'permission-role/:id'),
            component: PermissionRoleDetail,
          },
          {
            path: join(ROLE_ROUTE, 'create'),
            component: PermissionRoleDetail,
          },
          {
            path: join(ROLE_ROUTE),
            component: RoleMaster,
          },
        ],
      },
      {
        path: '/test',
        component: ATestMapView,
      },
      {
        path: INDIRECT_SALES_ORDER_ROUTE,
        component: IndirectSalesOrderView,
        children:
          [
            {
              path: join(INDIRECT_SALES_ORDER_ROUTE, ':id'),
              component: IndirectSalesOrderDetail,
            },
            {
              path: join(INDIRECT_SALES_ORDER_ROUTE),
              component: IndirectSalesOrderMaster,
            },
          ],
      },
    ],
  },
];
