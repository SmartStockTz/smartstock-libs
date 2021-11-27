import {HttpClientAdapter, RestRequestConfig} from 'bfast';
import {HttpRequestInfoModel} from 'bfast/dist/lib/models/http-request-info.model';
import {HttpClient} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SmartstockHttpAdapter extends HttpClientAdapter {
  constructor(private readonly httpClient: HttpClient) {
    super();
  }

  delete(url: string, config: RestRequestConfig, info: HttpRequestInfoModel): Promise<any> {
    // @ts-ignore
    const rq = this.httpClient.delete(url, {
      body: config.data,
      ...config
    });
    return firstValueFrom(rq).then(value => {
      return {data: value};
    }).catch(reason => {
      throw reason.error;
    });
  }

  get(url: string, config: any, info: HttpRequestInfoModel): Promise<any> {
    const rq = this.httpClient.get(url, config);
    return firstValueFrom(rq).then(value => {
      return {data: value};
    }).catch(reason => {
      throw reason.error;
    });
  }

  head(url: string, config: any, info: HttpRequestInfoModel): Promise<any> {
    const rq = this.httpClient.head(url, config);
    return firstValueFrom(rq).then(value => {
      return {data: value};
    }).catch(reason => {
      throw reason.error;
    });
  }

  options(url: string, config: any, info: HttpRequestInfoModel): Promise<any> {
    const rq = this.httpClient.options(url, config);
    return firstValueFrom(rq).then(value => {
      return {data: value};
    }).catch(reason => {
      throw reason.error;
    });
  }

  patch(url: string, data: any, config: any, info: HttpRequestInfoModel): Promise<any> {
    const rq = this.httpClient.patch(url, data, config);
    return firstValueFrom(rq).then(value => {
      return {data: value};
    }).catch(reason => {
      throw reason.error;
    });
  }

  post(url: string, data: any, config: any, info: HttpRequestInfoModel): Promise<any> {
    const rq = this.httpClient.post(url, data, config);
    return firstValueFrom(rq).then(value => {
      return {data: value};
    }).catch(reason => {
      throw reason.error;
    });
  }

  put(url: string, data: any, config: any, info: HttpRequestInfoModel): Promise<any> {
    const rq = this.httpClient.put(url, data, config);
    return firstValueFrom(rq).then(value => {
      return {data: value};
    }).catch(reason => {
      throw reason.error;
    });
  }
}
