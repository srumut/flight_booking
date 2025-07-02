import { Injectable } from '@nestjs/common';
import e from 'express';
import { Prisma } from 'generated/prisma';
import { DatabaseService } from 'src/database/database.service';
import { v4 as uuid4 } from 'uuid';

@Injectable()
export class FlightsService {
    constructor(private readonly db: DatabaseService) {}

    async getAll() {
        return await this.db.flight.findMany();
    }

    async getById(id: string) {
        return await this.db.flight.findUnique({
            where: {
                id,
            },
        });
    }

    async create(dto: Prisma.FlightCreateInput) {
        dto.id = uuid4();
        dto.departure_time = new Date(dto.departure_time);
        dto.arrival_time = new Date(dto.arrival_time);
        return await this.db.flight.create({ data: dto });
    }
}
