import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuid4 } from 'uuid';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Injectable()
export class FlightsService {
    constructor(private readonly db: DatabaseService) {}

    async getAll(args: object) {
        return await this.db.flight.findMany(args);
    }

    async getById(id: string) {
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

    async create(dto: CreateFlightDto) {
        if (dto.arrival_time <= dto.departure_time) {
            throw new HttpException(
                {
                    message: `Arrival time must be later than departure time`,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.db.flight.create({
            data: {
                id: uuid4(),
                seats_available: dto.seats_total,
                ...dto,
            },
        });
    }

    async update(id: string, dto: UpdateFlightDto) {
        const flight = await this.getById(id);
        let data = { ...flight };
        for (let key in dto) {
            if (dto[key] === undefined || dto[key] === null) {
                continue;
            }
            data[key] = dto[key];
        }
        if (data.seats_total > flight.seats_total) {
            data.seats_available += data.seats_total - flight.seats_total;
        }
        console.log(data);
        if (data.arrival_time <= data.departure_time) {
            throw new HttpException(
                {
                    message: `Arrival time must be later than departure time`,
                },
                HttpStatus.BAD_REQUEST,
            );
        }
        return await this.db.flight.update({
            where: { id },
            data: data,
        });
    }

    async delete(id: string) {
        try {
            return await this.db.flight.delete({ where: { id } });
        } catch (error) {
            switch (error.code) {
                case 'P2025':
                    throw new HttpException(
                        {
                            message: `No flight with id ${id} exists`,
                        },
                        HttpStatus.NOT_FOUND,
                    );
            }
            throw error;
        }
    }
}
