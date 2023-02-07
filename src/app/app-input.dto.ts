import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';
import Companies from 'src/constants/CompaniesEnum';

export class WizardRouteDto {
  @ApiProperty()
  @IsUUID()
  readonly sessionId: string;

  @ApiProperty({
    enum: Companies,
    isArray: false,
    example: Companies.Default
  })
  @IsEnum(Companies)
  @IsNotEmpty()
  readonly companyId: Companies;
}

export class CreateSessionDto {
  @ApiProperty({
    enum: Companies,
    isArray: false,
    example: Companies.Default
  })
  @IsEnum(Companies)
  @IsNotEmpty()
  readonly companyId: Companies;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  readonly clientId: string;
}
