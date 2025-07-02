import { Module } from '@nestjs/common';
import { FlightsController } from './flight.controller';
import { FlightsService } from './flights.service';
import { DatabaseModule } from 'src/database/database.module';

@Module({
    imports: [DatabaseModule],
    controllers: [FlightsController],
    providers: [FlightsService],
})
export class FlightsModule {}
