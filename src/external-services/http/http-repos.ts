import { Injectable } from '@nestjs/common';
import { ClientHttp } from './client.service';

@Injectable()
export class HttpRepositories {
  constructor(public readonly clientRepository: ClientHttp) {}
}
