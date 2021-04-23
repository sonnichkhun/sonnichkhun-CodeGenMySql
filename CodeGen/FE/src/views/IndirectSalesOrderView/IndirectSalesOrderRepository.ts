import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_INDIRECT_SALES_ORDER_ROUTE } from 'config/api-consts';
import { IndirectSalesOrder } from 'models/IndirectSalesOrder';
import { IndirectSalesOrderFilter } from 'models/IndirectSalesOrderFilter';
import { Store } from 'models/Store';
import { StoreFilter } from 'models/StoreFilter';
import { RequestStateStatus } from 'models/RequestStateStatus';
import { RequestStateStatusFilter } from 'models/RequestStateStatusFilter';
import { AppUser } from 'models/AppUser';
import { AppUserFilter } from 'models/AppUserFilter';
import { IndirectSalesOrderContent } from 'models/IndirectSalesOrderContent';
import { IndirectSalesOrderContentFilter } from 'models/IndirectSalesOrderContentFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { IndirectSalesOrderPromotion } from 'models/IndirectSalesOrderPromotion';
import { IndirectSalesOrderPromotionFilter } from 'models/IndirectSalesOrderPromotionFilter';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { EditPriceStatusFilter } from 'models/EditPriceStatusFilter';
import { EditPriceStatus } from 'models/EditPriceStatus';

export class IndirectSalesOrderRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_INDIRECT_SALES_ORDER_ROUTE));
  }

  public count = (indirectSalesOrderFilter?: IndirectSalesOrderFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), indirectSalesOrderFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (indirectSalesOrderFilter?: IndirectSalesOrderFilter): Promise<IndirectSalesOrder[]> => {
    return this.http.post<IndirectSalesOrder[]>(kebabCase(nameof(this.list)), indirectSalesOrderFilter)
      .then((response: AxiosResponse<IndirectSalesOrder[]>) => {
        return response.data?.map((indirectSalesOrder: PureModelData<IndirectSalesOrder>) => IndirectSalesOrder.clone<IndirectSalesOrder>(indirectSalesOrder));
      });
  };

  public countStore = (storeFilter?: StoreFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.countStore)), storeFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listStore = (storeFilter?: StoreFilter): Promise<Store[]> => {
    return this.http.post<Store[]>(kebabCase(nameof(this.listStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data?.map((store: PureModelData<Store>) => Store.clone<Store>(store));
      });
  };

  public countItem = (itemFilter?: ItemFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.countItem)), itemFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public listItem = (itemFilter?: ItemFilter): Promise<Item[]> => {
    return this.http
      .post<Item[]>(kebabCase(nameof(this.listItem)), itemFilter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data?.map((item: PureModelData<Item>) =>
          Item.clone<Item>(item),
        );
      });
  };

  public get = (id: number | string): Promise<IndirectSalesOrder> => {
    return this.http.post<IndirectSalesOrder>
      (kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<IndirectSalesOrder>) => IndirectSalesOrder.clone<IndirectSalesOrder>(response.data));
  };

  public create = (indirectSalesOrder: IndirectSalesOrder): Promise<IndirectSalesOrder> => {
    return this.http.post<IndirectSalesOrder>(kebabCase(nameof(this.create)), indirectSalesOrder)
      .then((response: AxiosResponse<PureModelData<IndirectSalesOrder>>) => IndirectSalesOrder.clone<IndirectSalesOrder>(response.data));
  };

  public update = (indirectSalesOrder: IndirectSalesOrder): Promise<IndirectSalesOrder> => {
    return this.http.post<IndirectSalesOrder>(kebabCase(nameof(this.update)), indirectSalesOrder)
      .then((response: AxiosResponse<IndirectSalesOrder>) => IndirectSalesOrder.clone<IndirectSalesOrder>(response.data));
  };

  public delete = (indirectSalesOrder: IndirectSalesOrder): Promise<IndirectSalesOrder> => {
    return this.http.post<IndirectSalesOrder>(kebabCase(nameof(this.delete)), indirectSalesOrder)
      .then((response: AxiosResponse<IndirectSalesOrder>) => IndirectSalesOrder.clone<IndirectSalesOrder>(response.data));
  };

  public save = (indirectSalesOrder: IndirectSalesOrder): Promise<IndirectSalesOrder> => {
    return indirectSalesOrder.id ? this.update(indirectSalesOrder) : this.create(indirectSalesOrder);
  };

  public filterListStore = (storeFilter: StoreFilter): Promise<Store[]> => {
    return this.http.post<Store[]>(kebabCase(nameof(this.filterListStore)), storeFilter)
      .then((response: AxiosResponse<Store[]>) => {
        return response.data.map((store: PureModelData<Store>) => Store.clone<Store>(store));
      });
  };
  public singleListRequestState = (): Promise<RequestStateStatus[]> => {
    return this.http.post<RequestStateStatus[]>(kebabCase(nameof(this.singleListRequestState)), new RequestStateStatusFilter())
      .then((response: AxiosResponse<RequestStateStatus[]>) => {
        return response.data.map((requestStateStatus: PureModelData<RequestStateStatus>) => RequestStateStatus.clone<RequestStateStatus>(requestStateStatus));
      });
  };
  public filterListAppUser = (appUserFilter: AppUserFilter): Promise<AppUser[]> => {
    return this.http.post<AppUser[]>(kebabCase(nameof(this.filterListAppUser)), appUserFilter)
      .then((response: AxiosResponse<AppUser[]>) => {
        return response.data.map((appUser: PureModelData<AppUser>) => AppUser.clone<AppUser>(appUser));
      });
  };

  public singleListEditPriceStatus = (): Promise<EditPriceStatus[]> => {
    return this.http
      .post<EditPriceStatus[]>(
        kebabCase(nameof(this.singleListEditPriceStatus)),
        new EditPriceStatusFilter(),
      )
      .then((response: AxiosResponse<EditPriceStatus[]>) => {
        return response.data.map((status: PureModelData<EditPriceStatus>) =>
          EditPriceStatus.clone<EditPriceStatus>(status),
        );
      });
  };

  public filterListIndirectSalesOrderContent = (indirectSalesOrderContentFilter: IndirectSalesOrderContentFilter): Promise<IndirectSalesOrderContent[]> => {
    return this.http.post<IndirectSalesOrderContent[]>(kebabCase(nameof(this.filterListIndirectSalesOrderContent)), indirectSalesOrderContentFilter)
      .then((response: AxiosResponse<IndirectSalesOrderContent[]>) => {
        return response.data.map((indirectSalesOrderContent: PureModelData<IndirectSalesOrderContent>) => IndirectSalesOrderContent.clone<IndirectSalesOrderContent>(indirectSalesOrderContent));
      });
  };
  public singleListUnitOfMeasure = (unitOfMeasureFilter: UnitOfMeasureFilter): Promise<UnitOfMeasure[]> => {
    return this.http.post<UnitOfMeasure[]>(kebabCase(nameof(this.singleListUnitOfMeasure)), unitOfMeasureFilter)
      .then((response: AxiosResponse<UnitOfMeasure[]>) => {
        return response.data.map((unitOfMeasure: PureModelData<UnitOfMeasure>) => UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure));
      });
  };

  public singleListIndirectSalesOrderPromotion = (indirectSalesOrderPromotionFilter: IndirectSalesOrderPromotionFilter): Promise<IndirectSalesOrderPromotion[]> => {
    return this.http.post<IndirectSalesOrderPromotion[]>(kebabCase(nameof(this.singleListIndirectSalesOrderPromotion)), indirectSalesOrderPromotionFilter)
      .then((response: AxiosResponse<IndirectSalesOrderPromotion[]>) => {
        return response.data.map((indirectSalesOrderPromotion: PureModelData<IndirectSalesOrderPromotion>) => IndirectSalesOrderPromotion.clone<IndirectSalesOrderPromotion>(indirectSalesOrderPromotion));
      });
  };
  public singleListItem = (itemFilter: ItemFilter): Promise<Item[]> => {
    return this.http.post<Item[]>(kebabCase(nameof(this.singleListItem)), itemFilter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data.map((item: PureModelData<Item>) => Item.clone<Item>(item));
      });
  };


  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http.post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http.post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };
}

export const indirectSalesOrderRepository: IndirectSalesOrder = new IndirectSalesOrderRepository();
