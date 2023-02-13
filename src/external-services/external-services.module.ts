import { Module } from '@nestjs/common';
import { ClientHttp } from './http/client.service';
import { HttpRepositories } from './http/http-repos';

@Module({
  providers: [ClientHttp, HttpRepositories],
  exports: [HttpRepositories]
})
export class ExternalServicesModule {}
