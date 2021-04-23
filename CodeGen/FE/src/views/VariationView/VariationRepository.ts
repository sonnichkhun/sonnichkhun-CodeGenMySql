import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_VARIATION_ROUTE} from 'config/api-consts';
import { Variation } from 'models/Variation';
import { VariationFilter } from 'models/VariationFilter';
import { VariationGrouping } from 'models/VariationGrouping';
import { VariationGroupingFilter } from 'models/VariationGroupingFilter';

export class VariationRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_VARIATION_ROUTE));
  }

  public count = (variationFilter?: VariationFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), variationFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (variationFilter?: VariationFilter): Promise<Variation[]> => {
    return this.http.post<Variation[]>(kebabCase(nameof(this.list)), variationFilter)
      .then((response: AxiosResponse<Variation[]>) => {
        return response.data?.map((variation: PureModelData<Variation>) =>  Variation.clone<Variation>(variation));
    });
  };

  public get = (id: number | string): Promise<Variation> => {
    return this.http.post<Variation>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<Variation>) => Variation.clone<Variation>(response.data));
  };

  public create = (variation: Variation): Promise<Variation> => {
    return this.http.post<Variation>(kebabCase(nameof(this.create)), variation)
      .then((response: AxiosResponse<PureModelData<Variation>>) => Variation.clone<Variation>(response.data));
  };

  public update = (variation: Variation): Promise<Variation> => {
    return this.http.post<Variation>(kebabCase(nameof(this.update)), variation)
      .then((response: AxiosResponse<Variation>) => Variation.clone<Variation>(response.data));
  };

  public delete = (variation: Variation): Promise<Variation> => {
      return this.http.post<Variation>(kebabCase(nameof(this.delete)), variation)
        .then((response: AxiosResponse<Variation>) => Variation.clone<Variation>(response.data));
  };

  public save = (variation: Variation): Promise<Variation> => {
      return variation.id ? this.update(variation) : this.create(variation);
  };

  public singleListVariationGrouping = (variationGroupingFilter: VariationGroupingFilter): Promise<VariationGrouping[]> => {
      return this.http.post<VariationGrouping[]>(kebabCase(nameof(this.singleListVariationGrouping)), variationGroupingFilter)
        .then((response: AxiosResponse<VariationGrouping[]>) => {
          return response.data.map((variationGrouping: PureModelData<VariationGrouping>) => VariationGrouping.clone<VariationGrouping>(variationGrouping));
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

  export const variationRepository: Variation = new VariationRepository();