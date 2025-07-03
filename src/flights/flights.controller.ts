import {
    Controller,
    Get,
    HttpException,
    HttpStatus,
    Param,
    Post,
    Body,
    Patch,
    Delete,
    Query,
} from '@nestjs/common';
import { FlightsService } from './flights.service';
import { Prisma } from 'generated/prisma';
import { CreateFlightDto } from './dto/create-flight.dto';
import { UpdateFlightDto } from './dto/update-flight.dto';

@Controller('flights')
export class FlightsController {
    constructor(private readonly service: FlightsService) {}

    @Get()
    async getAll(
        @Query('from_city') from_city: string,
        @Query('to_city') to_city: string,
        @Query('departure_time') departure_time: string,
        @Query('min_price') min_price: number,
        @Query('max_price') max_price: number,
    ) {
        const args = { where: {}, orderBy: {} };
        if (from_city) args.where['from_city'] = from_city;
        if (to_city) args.where['to_city'] = to_city;
        if (departure_time) {
            try {
                args.where['departure_time'] = {
                    gte: new Date(departure_time).toISOString(),
                };
            } catch (error) {
                throw new HttpException(
                    {
                        message:
                            'Error parsing departure time, provide a valid date',
                    },
                    HttpStatus.BAD_GATEWAY,
                );
            }
        }
        args.where['price'] = {};
        if (min_price) args.where['price']['gte'] = min_price;
        if (max_price) args.where['price']['lte'] = max_price;

        return await this.service.getAll(args);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.service.getById(id);
    }

    @Post()
    async create(@Body() dto: CreateFlightDto) {
        try {
            return await this.service.create(dto);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError) {
                console.timeLog(JSON.stringify(error));
                switch (error?.code) {
                    case 'P2002':
                        throw new HttpException(
                            {
                                message: `There is another flight either departuring at the same time from the same city or arriving at the same time to the same city`,
                            },
                            HttpStatus.BAD_REQUEST,
                        );
                    case 'P2003':
                        throw new HttpException(
                            {
                                message: `Undefined city id`,
                            },
                            HttpStatus.BAD_REQUEST,
                        );
                }
            }
            throw error;
        }
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateFlightDto) {
        try {
            return await this.service.update(id, dto);
        } catch (error) {
            throw error;
        }
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
