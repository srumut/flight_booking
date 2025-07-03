import { Transform } from 'class-transformer';
import { Min, IsDateString, IsInt, IsNumber, Matches } from 'class-validator';

export class CreateFlightDto {
    @Matches(/^\d{2}$/, { message: 'from_city must be two digit string int' })
    from_city: string;

    @Matches(/^\d{2}$/, { message: 'to_city must be two digit string int' })
    to_city: string;

    @IsDateString()
    @Transform(({ value }) => new Date(value))
    departure_time: Date;

    @IsDateString()
    @Transform(({ value }) => new Date(value))
    arrival_time: Date;

    @IsInt()
    @Min(0)
    seats_total: number;

    @IsNumber()
    @Min(0)
    price: number;
}
