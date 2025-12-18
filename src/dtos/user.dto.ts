import { IsDateString, IsEmail, IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';
import { UserStatus } from '../models/User';

export class CreateUserDto {
    @IsNumber()
    @IsNotEmpty()
    subOrganizationId: number;

    @IsString()
    @IsOptional()
    @Length(1, 50)
    employeeCode?: string;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    firstName?: string;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    lastName?: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsNotEmpty()
    @Length(6, 100)
    password: string;

    @IsNumber()
    @IsOptional()
    currentManagerId?: number;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    designation?: string;

    @IsDateString()
    @IsOptional()
    joiningDate?: string;

    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;
}

export class UpdateUserDto {
    @IsString()
    @IsOptional()
    @Length(1, 50)
    employeeCode?: string;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    firstName?: string;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    lastName?: string;

    @IsNumber()
    @IsOptional()
    currentManagerId?: number;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    designation?: string;

    @IsDateString()
    @IsOptional()
    joiningDate?: string;

    @IsEnum(UserStatus)
    @IsOptional()
    status?: UserStatus;
}
