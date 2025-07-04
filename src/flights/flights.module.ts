import { Module } from '@nestjs/common';
import { FlightsController } from './flights.controller';
import { FlightsService } from './flights.service';
import { DatabaseModule } from 'src/database/database.module';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
    imports: [DatabaseModule],
    controllers: [FlightsController, TicketsController],
    providers: [FlightsService, TicketsService],
})
export class FlightsModule {}
