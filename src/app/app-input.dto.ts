import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';
import Companies from 'src/constants/CompaniesEnum';
import Pages from 'src/constants/PagesEnum';
import Sections from 'src/constants/SectionsEnum';

export class WizardRouteDto {
  @ApiPropertyOptional()
  @IsOptional()
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
  @IsNotEmpty()
  readonly sessionId: string;

  @ApiProperty({
    enum: Sections,
    isArray: false,
    example: Sections.Property
  })
  @IsEnum(Sections)
  @IsNotEmpty()
  readonly section: Sections;

  @ApiProperty({
    enum: Pages,
    isArray: false,
    example: Pages.Payment
  })
  @IsEnum(Pages)
  @IsNotEmpty()
  readonly page: Pages;

  @ApiProperty()
  @IsObject()
  @IsNotEmpty()
  readonly data: any;
}

export class FindPageDataDto {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  readonly sessionId: string;

  @ApiProperty({
    enum: Sections,
    isArray: false,
    example: Sections.Property
  })
  @IsEnum(Sections)
  @IsNotEmpty()
  readonly section: Sections;

  @ApiProperty({
    enum: Pages,
    isArray: false,
    example: Pages.Payment
  })
  @IsEnum(Pages)
  @IsNotEmpty()
  readonly page: Pages;
}
