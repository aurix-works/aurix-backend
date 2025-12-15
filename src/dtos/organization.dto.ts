import { IsNotEmpty, IsOptional, IsString, Length } from 'class-validator';

export class CreateOrganizationDto {
    @IsString()
    @IsNotEmpty()
    @Length(1, 255)
    name: string;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    domain?: string;
}

export class UpdateOrganizationDto {
    @IsString()
    @IsOptional()
    @Length(1, 255)
    name?: string;

    @IsString()
    @IsOptional()
    @Length(1, 100)
    domain?: string;
}
