import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FlightsModule } from './flights/flights.module';

@Module({
    imports: [DatabaseModule, FlightsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
