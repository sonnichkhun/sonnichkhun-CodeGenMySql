import { AxiosResponse } from 'axios';
import nameof from 'ts-nameof.macro';
import { url } from 'core/helpers/string';
import { Repository } from 'core/repositories/Repository';
import kebabCase from 'lodash/kebabCase';
import { BatchId, PureModelData } from 'react3l';
import { httpConfig } from 'config/http';
import { API_BASE_URL } from 'core/config';

import { API_IMAGE_ROUTE } from 'config/api-consts';
import { Image } from 'models/Image';
import { ImageFilter } from 'models/ImageFilter';

export class ImageRepository extends Repository {
  constructor() {
    super(httpConfig);
    this.setBaseURL(url(API_BASE_URL, API_IMAGE_ROUTE));
  }

  public count = (imageFilter?: ImageFilter): Promise<number> => {
    return this.http
      .post<number>(kebabCase(nameof(this.count)), imageFilter)
      .then((response: AxiosResponse<number>) => response.data);
  };

  public list = (imageFilter?: ImageFilter): Promise<Image[]> => {
    return this.http
      .post<Image[]>(kebabCase(nameof(this.list)), imageFilter)
      .then((response: AxiosResponse<Image[]>) => {
        return response.data?.map((image: PureModelData<Image>) =>
          Image.clone<Image>(image),
        );
      });
  };

  public get = (id: number | string): Promise<Image> => {
    return this.http
      .post<Image>(kebabCase(nameof(this.get)), { id })
      .then((response: AxiosResponse<Image>) =>
        Image.clone<Image>(response.data),
      );
  };

  public create = (image: Image): Promise<Image> => {
    return this.http
      .post<Image>(kebabCase(nameof(this.create)), image)
      .then((response: AxiosResponse<PureModelData<Image>>) =>
        Image.clone<Image>(response.data),
      );
  };

  public update = (image: Image): Promise<Image> => {
    return this.http
      .post<Image>(kebabCase(nameof(this.update)), image)
      .then((response: AxiosResponse<Image>) =>
        Image.clone<Image>(response.data),
      );
  };

  public delete = (image: Image): Promise<Image> => {
    return this.http
      .post<Image>(kebabCase(nameof(this.delete)), image)
      .then((response: AxiosResponse<Image>) =>
        Image.clone<Image>(response.data),
      );
  };

  public save = (image: Image): Promise<Image> => {
    return image.id ? this.update(image) : this.create(image);
  };

  public bulkDelete = (idList: BatchId): Promise<void> => {
    return this.http
      .post(kebabCase(nameof(this.bulkDelete)), idList)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public import = (file: File, name: string = nameof(file)): Promise<void> => {
    const formData: FormData = new FormData();
    formData.append(name, file);
    return this.http
      .post<void>(kebabCase(nameof(this.import)), formData)
      .then((response: AxiosResponse<void>) => response.data);
  };

  public uploadImage = (
    file: File,
    params?: { [key: string]: any },
  ): Promise<Image> => {
    const formData: FormData = new FormData();
    formData.append('file', file);
    return this.http
      .post('/upload-image', formData, {
        params,
      })
      .then((response: AxiosResponse<Image>) => response.data);
  };
}

export const imageRepository: Image = new ImageRepository();
