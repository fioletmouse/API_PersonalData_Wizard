import { RequestBuilder } from './request-builder';

export class ClientHttp {
  private requestBuilderInstance: RequestBuilder;
  constructor() {
    this.requestBuilderInstance = new RequestBuilder();
  }

  async createEmptyClient(externalId: string): Promise<string> {
    try {
      const { data } = await this.requestBuilderInstance.post(
        'createClientId',
        { externalUserId: externalId },
        {}
      );
      console.log(data);
      // mock response
      data.clientId = 'external_' + externalId;
      return data.clientId;
    } catch (err) {
      throw new Error(`Can not create a new client. API response: ${err.message}`);
    }
  }
}
