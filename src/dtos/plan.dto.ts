import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreatePlanDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    code: string;

    @IsNumber()
    @IsOptional()
    priceMonthly?: number;

    @IsNumber()
    @IsOptional()
    priceYearly?: number;

    @IsArray()
    @IsOptional()
    serviceIds?: number[];
}

export class UpdatePlanDto {
    @IsString()
    @IsOptional()
    @Length(1, 100)
    name?: string;

    @IsString()
    @IsOptional()
    @Length(1, 50)
    code?: string;

    @IsNumber()
    @IsOptional()
    priceMonthly?: number;

    @IsNumber()
    @IsOptional()
    priceYearly?: number;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;

    @IsArray()
    @IsOptional()
    serviceIds?: number[];
}
