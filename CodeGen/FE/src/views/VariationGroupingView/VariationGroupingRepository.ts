import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_VARIATION_GROUPING_ROUTE} from 'config/api-consts';
import { VariationGrouping } from 'models/VariationGrouping';
import { VariationGroupingFilter } from 'models/VariationGroupingFilter';
import { Product } from 'models/Product';
import { ProductFilter } from 'models/ProductFilter';

export class VariationGroupingRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_VARIATION_GROUPING_ROUTE));
  }

  public count = (variationGroupingFilter?: VariationGroupingFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), variationGroupingFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (variationGroupingFilter?: VariationGroupingFilter): Promise<VariationGrouping[]> => {
    return this.http.post<VariationGrouping[]>(kebabCase(nameof(this.list)), variationGroupingFilter)
      .then((response: AxiosResponse<VariationGrouping[]>) => {
        return response.data?.map((variationGrouping: PureModelData<VariationGrouping>) =>  VariationGrouping.clone<VariationGrouping>(variationGrouping));
    });
  };

  public get = (id: number | string): Promise<VariationGrouping> => {
    return this.http.post<VariationGrouping>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<VariationGrouping>) => VariationGrouping.clone<VariationGrouping>(response.data));
  };

  public create = (variationGrouping: VariationGrouping): Promise<VariationGrouping> => {
    return this.http.post<VariationGrouping>(kebabCase(nameof(this.create)), variationGrouping)
      .then((response: AxiosResponse<PureModelData<VariationGrouping>>) => VariationGrouping.clone<VariationGrouping>(response.data));
  };

  public update = (variationGrouping: VariationGrouping): Promise<VariationGrouping> => {
    return this.http.post<VariationGrouping>(kebabCase(nameof(this.update)), variationGrouping)
      .then((response: AxiosResponse<VariationGrouping>) => VariationGrouping.clone<VariationGrouping>(response.data));
  };

  public delete = (variationGrouping: VariationGrouping): Promise<VariationGrouping> => {
      return this.http.post<VariationGrouping>(kebabCase(nameof(this.delete)), variationGrouping)
        .then((response: AxiosResponse<VariationGrouping>) => VariationGrouping.clone<VariationGrouping>(response.data));
  };

  public save = (variationGrouping: VariationGrouping): Promise<VariationGrouping> => {
      return variationGrouping.id ? this.update(variationGrouping) : this.create(variationGrouping);
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

  export const variationGroupingRepository: VariationGrouping = new VariationGroupingRepository();