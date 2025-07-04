import { IsString, IsEmail, IsNotEmpty } from 'class-validator';

export class CreateTicketDto {
    @IsString()
    @IsNotEmpty()
    flight_id: string;

    @IsString()
    @IsNotEmpty()
    passenger_name: string;

    @IsString()
    @IsNotEmpty()
    passenger_surname: string;

    @IsEmail()
    @IsNotEmpty()
    passenger_email: string;
}
