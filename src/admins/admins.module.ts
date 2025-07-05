import { Module } from '@nestjs/common';
import { AdminsService } from './admins.service';
import { DatabaseModule } from 'src/database/database.module';
import { AdminsController } from './admins.controller';

@Module({
    imports: [DatabaseModule],
    exports: [AdminsService],
    providers: [AdminsService],
    controllers: [AdminsController],
})
export class AdminsModule {}
