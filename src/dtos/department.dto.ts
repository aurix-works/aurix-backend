import { IsNotEmpty, IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateDepartmentDto {
    @IsNumber()
    @IsNotEmpty()
    subOrganizationId: number;

    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @IsString()
    @IsOptional()
    @Length(1, 20)
    code?: string;

    @IsNumber()
    @IsOptional()
    currentHeadUserId?: number;
}

export class UpdateDepartmentDto {
    @IsString()
    @IsOptional()
    @Length(1, 100)
    name?: string;

    @IsString()
    @IsOptional()
    @Length(1, 20)
    code?: string;

    @IsNumber()
    @IsOptional()
    currentHeadUserId?: number;
}
