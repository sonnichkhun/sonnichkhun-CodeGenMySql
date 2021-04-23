import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import {BatchId, PureModelData} from 'react3l';
import {httpConfig} from 'config/http';
import {API_BASE_URL} from 'core/config';

import {API_UNIT_OF_MEASURE_GROUPING_CONTENT_ROUTE} from 'config/api-consts';
import { UnitOfMeasureGroupingContent } from 'models/UnitOfMeasureGroupingContent';
import { UnitOfMeasureGroupingContentFilter } from 'models/UnitOfMeasureGroupingContentFilter';
import { UnitOfMeasure } from 'models/UnitOfMeasure';
import { UnitOfMeasureFilter } from 'models/UnitOfMeasureFilter';
import { UnitOfMeasureGrouping } from 'models/UnitOfMeasureGrouping';
import { UnitOfMeasureGroupingFilter } from 'models/UnitOfMeasureGroupingFilter';

export class UnitOfMeasureGroupingContentRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_UNIT_OF_MEASURE_GROUPING_CONTENT_ROUTE));
  }

  public count = (unitOfMeasureGroupingContentFilter?: UnitOfMeasureGroupingContentFilter): Promise<number> => {
    return this.http.post<number>(kebabCase(nameof(this.count)), unitOfMeasureGroupingContentFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (unitOfMeasureGroupingContentFilter?: UnitOfMeasureGroupingContentFilter): Promise<UnitOfMeasureGroupingContent[]> => {
    return this.http.post<UnitOfMeasureGroupingContent[]>(kebabCase(nameof(this.list)), unitOfMeasureGroupingContentFilter)
      .then((response: AxiosResponse<UnitOfMeasureGroupingContent[]>) => {
        return response.data?.map((unitOfMeasureGroupingContent: PureModelData<UnitOfMeasureGroupingContent>) =>  UnitOfMeasureGroupingContent.clone<UnitOfMeasureGroupingContent>(unitOfMeasureGroupingContent));
    });
  };

  public get = (id: number | string): Promise<UnitOfMeasureGroupingContent> => {
    return this.http.post<UnitOfMeasureGroupingContent>
      (kebabCase(nameof(this.get)), { id })
        .then((response: AxiosResponse<UnitOfMeasureGroupingContent>) => UnitOfMeasureGroupingContent.clone<UnitOfMeasureGroupingContent>(response.data));
  };

  public create = (unitOfMeasureGroupingContent: UnitOfMeasureGroupingContent): Promise<UnitOfMeasureGroupingContent> => {
    return this.http.post<UnitOfMeasureGroupingContent>(kebabCase(nameof(this.create)), unitOfMeasureGroupingContent)
      .then((response: AxiosResponse<PureModelData<UnitOfMeasureGroupingContent>>) => UnitOfMeasureGroupingContent.clone<UnitOfMeasureGroupingContent>(response.data));
  };

  public update = (unitOfMeasureGroupingContent: UnitOfMeasureGroupingContent): Promise<UnitOfMeasureGroupingContent> => {
    return this.http.post<UnitOfMeasureGroupingContent>(kebabCase(nameof(this.update)), unitOfMeasureGroupingContent)
      .then((response: AxiosResponse<UnitOfMeasureGroupingContent>) => UnitOfMeasureGroupingContent.clone<UnitOfMeasureGroupingContent>(response.data));
  };

  public delete = (unitOfMeasureGroupingContent: UnitOfMeasureGroupingContent): Promise<UnitOfMeasureGroupingContent> => {
      return this.http.post<UnitOfMeasureGroupingContent>(kebabCase(nameof(this.delete)), unitOfMeasureGroupingContent)
        .then((response: AxiosResponse<UnitOfMeasureGroupingContent>) => UnitOfMeasureGroupingContent.clone<UnitOfMeasureGroupingContent>(response.data));
  };

  public save = (unitOfMeasureGroupingContent: UnitOfMeasureGroupingContent): Promise<UnitOfMeasureGroupingContent> => {
      return unitOfMeasureGroupingContent.id ? this.update(unitOfMeasureGroupingContent) : this.create(unitOfMeasureGroupingContent);
  };

  public singleListUnitOfMeasure = (unitOfMeasureFilter: UnitOfMeasureFilter): Promise<UnitOfMeasure[]> => {
      return this.http.post<UnitOfMeasure[]>(kebabCase(nameof(this.singleListUnitOfMeasure)), unitOfMeasureFilter)
        .then((response: AxiosResponse<UnitOfMeasure[]>) => {
          return response.data.map((unitOfMeasure: PureModelData<UnitOfMeasure>) => UnitOfMeasure.clone<UnitOfMeasure>(unitOfMeasure));
        });
  };
  public singleListUnitOfMeasureGrouping = (unitOfMeasureGroupingFilter: UnitOfMeasureGroupingFilter): Promise<UnitOfMeasureGrouping[]> => {
      return this.http.post<UnitOfMeasureGrouping[]>(kebabCase(nameof(this.singleListUnitOfMeasureGrouping)), unitOfMeasureGroupingFilter)
        .then((response: AxiosResponse<UnitOfMeasureGrouping[]>) => {
          return response.data.map((unitOfMeasureGrouping: PureModelData<UnitOfMeasureGrouping>) => UnitOfMeasureGrouping.clone<UnitOfMeasureGrouping>(unitOfMeasureGrouping));
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

  export const unitOfMeasureGroupingContentRepository: UnitOfMeasureGroupingContent = new UnitOfMeasureGroupingContentRepository();