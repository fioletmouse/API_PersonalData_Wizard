import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsString, IsUUID } from 'class-validator';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';

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

export class PatchPageDto {
  @ApiProperty()
  @IsUUID()
  readonly sessionId: string;

  @ApiProperty({
    enum: Sections,
    isArray: false,
    example: Sections.Property
  })
  @IsEnum(Sections)
  readonly section: Sections;

  @ApiProperty({
    enum: Pages,
    isArray: false,
    example: Pages.Payment
  })
  @IsEnum(Pages)
  readonly step: Pages;

  @ApiProperty()
  @IsObject()
  readonly data: any;
}
