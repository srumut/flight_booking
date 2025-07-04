import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';

@Controller('tickets')
export class TicketsController {
    constructor(private readonly service: TicketsService) {}

    @Get()
    async getAll(@Query('flight_id') flight_id: string) {
        const args = { where: {} };
        if (flight_id) args.where['flight_id'] = flight_id;
        return await this.service.getAll(args);
    }

    @Get(':id')
    async getById(@Param('id') id: string) {
        return await this.service.getById(id);
    }

    @Post()
    async create(@Body() dto: CreateTicketDto) {
        return await this.service.create(dto);
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
        return await this.service.update(id, dto);
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
