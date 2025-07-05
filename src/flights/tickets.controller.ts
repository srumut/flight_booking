import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Query,
    UseGuards,
} from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { AuthGuard } from 'src/auth/auth.guard';

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

    @UseGuards(AuthGuard)
    @Post()
    async create(@Body() dto: CreateTicketDto) {
        return await this.service.create(dto);
    }

    @UseGuards(AuthGuard)
    @Patch(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateTicketDto) {
        return await this.service.update(id, dto);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return await this.service.delete(id);
    }
}
