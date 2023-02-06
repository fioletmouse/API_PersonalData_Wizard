import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class WizardRouteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly sessionID: string;
}
