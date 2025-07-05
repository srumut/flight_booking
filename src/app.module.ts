import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { FlightsModule } from './flights/flights.module';
import { AuthModule } from './auth/auth.module';
import { AdminsModule } from './admins/admins.module';

@Module({
    imports: [DatabaseModule, FlightsModule, AuthModule, AdminsModule],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
