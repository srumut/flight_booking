import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { v4 as uuid4 } from 'uuid';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Injectable()
export class TicketsService {
    constructor(private readonly db: DatabaseService) {}

    async getAll(args: {}) {
        return await this.db.ticket.findMany(args);
    }

    async getById(id: string) {
        const ticket = await this.db.ticket.findUnique({ where: { id: id } });
        if (!ticket) {
            throw new HttpException(
                {
                    message: `No ticket with id ${id} exists`,
                },
                HttpStatus.NOT_FOUND,
            );
        }
        return ticket;
    }

    async getFlightById(id: string) {
        const flight = await this.db.flight.findUnique({
            where: {
                id,
            },
        });
        if (!flight) {
            throw new HttpException(
                {
                    message: `No flight with id ${id} exists`,
                },
                HttpStatus.NOT_FOUND,
            );
        }
        return flight;
    }

    async create(dto: CreateTicketDto) {
        const flight = await this.getFlightById(dto.flight_id);
        if (flight.seats_available <= 0) {
            throw new HttpException(
                {
                    message:
                        'All seats are booked, no seat is available on the flight',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        if (flight.departure_time <= new Date(Date.now())) {
            throw new HttpException(
                {
                    message: 'The flight has departured already',
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        const ticket = await this.db.ticket.create({
            data: {
                id: uuid4(),
                ...dto,
            },
        });

        await this.db.flight.update({
            where: {
                id: dto.flight_id,
            },
            data: {
                seats_available: {
                    decrement: 1,
                },
            },
        });

        return ticket;
    }

    async update(id: string, dto: UpdateTicketDto) {
        const ticket = await this.getById(id);

        if (dto?.flight_id && dto.flight_id !== ticket.flight_id) {
            const new_flight = await this.getFlightById(dto.flight_id);
            if (new_flight.seats_available <= 0) {
                throw new HttpException(
                    {
                        message:
                            'All seats are booked, no seat is available on the flight',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }
            if (new_flight.departure_time <= new Date(Date.now())) {
                throw new HttpException(
                    {
                        message: 'The flight has departured already',
                    },
                    HttpStatus.BAD_REQUEST,
                );
            }

            const old_flight = await this.getFlightById(ticket.flight_id);
            await this.db.flight.update({
                where: {
                    id: old_flight.id,
                },
                data: {
                    seats_available: { increment: 1 },
                },
            });
            await this.db.flight.update({
                where: {
                    id: new_flight.id,
                },
                data: { seats_available: { decrement: 1 } },
            });
        }
        const data = {
            ...ticket,
            ...dto,
        };

        return await this.db.ticket.update({
            where: {
                id,
            },
            data,
        });
    }

    async delete(id: string) {
        const ticket = await this.getById(id);
        const flight = await this.getFlightById(ticket.flight_id);

        await this.db.flight.update({
            where: {
                id: ticket.flight_id,
            },
            data: {
                seats_available: { increment: 1 },
            },
        });

        return await this.db.ticket.delete({ where: { id } });
    }
}
