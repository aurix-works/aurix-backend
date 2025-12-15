import { IsDateString, IsEnum, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';
import { SubscriptionStatus } from '../models/SubOrgSubscription';

export class CreateSubscriptionDto {
    @IsNumber()
    @IsNotEmpty()
    subOrganizationId: number;

    @IsNumber()
    @IsNotEmpty()
    planId: number;

    @IsDateString()
    @IsNotEmpty()
    startDate: string;

    @IsDateString()
    @IsNotEmpty()
    nextBillingDate: string;

    @IsEnum(SubscriptionStatus)
    @IsOptional()
    status?: SubscriptionStatus;

    @IsNumber()
    @IsOptional()
    finalPrice?: number;
}

export class UpdateSubscriptionDto {
    @IsNumber()
    @IsOptional()
    planId?: number;

    @IsDateString()
    @IsOptional()
    nextBillingDate?: string;

    @IsEnum(SubscriptionStatus)
    @IsOptional()
    status?: SubscriptionStatus;

    @IsNumber()
    @IsOptional()
    finalPrice?: number;
}
