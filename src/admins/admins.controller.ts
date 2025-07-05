import { Body, Controller, Post } from '@nestjs/common';
import { CreateAdminDto } from './dto/create-admin.dto';
import { AdminsService } from './admins.service';

@Controller('admins')
export class AdminsController {
    constructor(private readonly service: AdminsService) {}

    @Post()
    async create(@Body() dto: CreateAdminDto) {
        await this.service.create(dto.username, dto.password);
        return { message: 'Admin created successfully' };
    }
}
