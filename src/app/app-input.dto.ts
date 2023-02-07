import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import Companies from 'src/constants/CompaniesEnum';

export class WizardRouteDto {
  @ApiProperty()
  @IsString()
  readonly sessionId: string;

  @ApiProperty({
    enum: Companies,
    isArray: false,
    example: Companies.Default
  })
  @IsEnum(Companies)
  @IsNotEmpty()
  readonly companyID: Companies;
}
