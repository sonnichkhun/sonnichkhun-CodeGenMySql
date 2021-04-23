import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_ITEM_ROUTE} from 'config/api-consts';
import { Item } from 'models/Item';
import { ItemFilter } from 'models/ItemFilter';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';

export class ItemRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_ITEM_ROUTE));
  }

  public count = (itemFilter?: ItemFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), itemFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (itemFilter?: ItemFilter): Promise<Item[]> => {
    return this.http.post<Item[]>(kebabCase(nameof(this.list)), itemFilter)
      .then((response: AxiosResponse<Item[]>) => {
        return response.data?.map((item: PureModelData<Item>) =>  Item.clone<Item>(item));
    });
  };

  public get = (id: number | string): Promise<Item> => {
    return this.http.post<Item>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<Item>) => Item.clone<Item>(response.data));
  };

  public create = (item: Item): Promise<Item> => {
    return this.http.post<Item>(kebabCase(nameof(this.create)), item)
      .then((response: AxiosResponse<PureModelData<Item>>) => Item.clone<Item>(response.data));
  };

  public update = (item: Item): Promise<Item> => {
    return this.http.post<Item>(kebabCase(nameof(this.update)), item)
      .then((response: AxiosResponse<Item>) => Item.clone<Item>(response.data));
  };

  public delete = (item: Item): Promise<Item> => {
      return this.http.post<Item>(kebabCase(nameof(this.delete)), item)
        .then((response: AxiosResponse<Item>) => Item.clone<Item>(response.data));
  };

  public save = (item: Item): Promise<Item> => {
      return item.id ? this.update(item) : this.create(item);
  };

  public singleListProduct = (productFilter: ProductFilter): Promise<Product[]> => {
      return this.http.post<Product[]>(kebabCase(nameof(this.singleListProduct)), productFilter)
        .then((response: AxiosResponse<Product[]>) => {
          return response.data.map((product: PureModelData<Product>) => Product.clone<Product>(product));
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

  export const itemRepository: Item = new ItemRepository();