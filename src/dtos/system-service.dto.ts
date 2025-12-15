import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateSystemServiceDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 100)
    name: string;

    @IsString()
    @IsNotEmpty()
    @Length(1, 50)
    code: string;

    @IsString()
    @IsOptional()
    description?: string;
}

export class UpdateSystemServiceDto {
    @IsString()
    @IsOptional()
    @Length(1, 100)
    name?: string;

    @IsString()
    @IsOptional()
    @Length(1, 50)
    code?: string;

    @IsString()
    @IsOptional()
    description?: string;
}
