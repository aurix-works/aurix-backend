import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreatePermissionDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    slug: string;

    @IsString()
    @IsOptional()
    @Length(1, 255)
    description?: string;
}

export class UpdatePermissionDto {
    @IsString()
    @IsOptional()
    @Length(1, 100)
    slug?: string;

    @IsString()
    @IsOptional()
    @Length(1, 255)
    description?: string;
}
