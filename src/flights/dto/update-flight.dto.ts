import { Transform } from 'class-transformer';
import {
    IsInt,
    Matches,
    IsOptional,
    IsDateString,
    IsNumber,
    Min,
} from 'class-validator';

export class UpdateFlightDto {
    @IsOptional()
    @Matches(/^\d{2}$/, { message: 'from_city must be two digit string int' })
    from_city?: string;

    @IsOptional()
    @Matches(/^\d{2}$/, { message: 'to_city must be two digit string int' })
    to_city?: string;

    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => new Date(value))
    departure_time?: Date;

    @IsOptional()
    @IsDateString()
    @Transform(({ value }) => new Date(value))
    arrival_time?: Date;

    @IsOptional()
    @Min(0)
    @IsInt()
    seats_total?: number;

    @IsOptional()
    @Min(0)
    @IsInt()
    seats_available?: number;

    @IsOptional()
    @Min(0)
    @IsNumber()
    price?: number;
}
