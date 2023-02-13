import { AxiosRequestConfig, Method } from 'axios';

interface RequestShortResponse {
  data: any;
  status: number;
  statusText: string;
  headers?: any;
}

export class RequestBuilder {
  constructor() {
    // add logger for external requests
  }

  private async request(
    url: string,
    method: Method,
    params?: AxiosRequestConfig,
    body?: any
  ): Promise<RequestShortResponse> {
    try {
      const requestParams = params || {};
      requestParams.url = url;
      requestParams.method = method;
      if (body) {
        requestParams.data = body;
      }

      // const { status, data, statusText } = await Axios(requestParams);
      // mock response
      const { status, data, statusText } = {
        status: 200,
        data: { text: 'success' },
        statusText: 'OK'
      };
      return { status, data, statusText };
    } catch (err) {
      // log error
      // add error handling
      return null;
    }
  }

  public async get(url: string, params?: AxiosRequestConfig): Promise<RequestShortResponse> {
    return this.request(url, 'GET', params);
  }

  public async post(url: string, body?: any, params?: AxiosRequestConfig): Promise<RequestShortResponse> {
    return this.request(url, 'POST', params, body);
  }

  public async put(url: string, body?: any, params?: AxiosRequestConfig): Promise<RequestShortResponse> {
    return this.request(url, 'PUT', params, body);
  }

  public async delete(url: string, params?: AxiosRequestConfig): Promise<RequestShortResponse> {
    return this.request(url, 'DELETE', params);
  }
}
