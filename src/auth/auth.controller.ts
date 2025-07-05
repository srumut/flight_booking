import {
    Controller,
    Post,
    Body,
    HttpCode,
    HttpStatus,
    UseGuards,
    Get,
    Request,
} from '@nestjs/common';
import { AdminLoginDto } from './dto/login-admin.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {
    constructor(private readonly service: AuthService) {}

    @Post('admin/login')
    @HttpCode(HttpStatus.OK)
    async adminLogin(@Body() dto: AdminLoginDto) {
        return await this.service.adminSignIn(dto.username, dto.password);
    }

    @UseGuards(AuthGuard)
    @Get('profile')
    async profile(@Request() req) {
        return req.user;
    }
}
