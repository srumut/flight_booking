import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Body,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { Prisma } from 'generated/prisma';

@Controller('flights')
export class FlightsController {
    constructor(private readonly service: FlightsService) {}

    @Get()
    async getAll() {
        return await this.service.getAll();
    }

    @Get(':id')
    async getById(@Param() params: any) {
        const flight = await this.service.getById(params.id);
        if (!flight) {
            throw new HttpException(
                {
                    status: HttpStatus.NOT_FOUND,
                    error: `No flight with id ${params.id} exists`,
                },
                HttpStatus.NOT_FOUND,
            );
        }
        return flight;
    }

    @Post()
    async create(@Body() dto: Prisma.FlightCreateInput) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                if (error.code === 'P2002') {
                    throw new HttpException(
                        {
                            status: HttpStatus.BAD_REQUEST,
                            error: `There is another flight either departuring at the same time from the same city or arriving at the same time to the same city.`,
                        },
                        HttpStatus.BAD_REQUEST,
                    );
                }
            }
            throw error;
        }
    }
}
