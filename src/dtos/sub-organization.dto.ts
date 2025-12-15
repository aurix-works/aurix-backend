import { IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { AccountStatus } from '../models/SubOrganization';

export class CreateSubOrganizationDto {
    @IsNumber()
    @IsNotEmpty()
    organizationId: number;

    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @IsString()
    @IsOptional()
    taxId?: string;

    @IsString()
    @IsOptional()
    billingAddress?: string;
}

export class UpdateSubOrganizationDto {
    @IsString()
    @IsOptional()
    @Length(1, 255)
    name?: string;

    @IsEmail()
    @IsOptional()
    contactEmail?: string;

    @IsString()
    @IsOptional()
    taxId?: string;

    @IsString()
    @IsOptional()
    billingAddress?: string;

    @IsEnum(AccountStatus)
    @IsOptional()
    accountStatus?: AccountStatus;
}
