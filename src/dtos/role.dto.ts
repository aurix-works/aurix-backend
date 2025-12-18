import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateRoleDto {
    @IsNumber()
    @IsNotEmpty()
    subOrganizationId: number;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    permissionIds?: number[];
}

export class UpdateRoleDto {
    @IsString()
    @IsOptional()
    @Length(1, 50)
    name?: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsArray()
    @IsOptional()
    permissionIds?: number[];
}
