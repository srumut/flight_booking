import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { AdminsService } from 'src/admins/admins.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private readonly adminsService: AdminsService,
        private readonly jwtService: JwtService,
    ) {}

    async adminSignIn(username: string, password: string) {
        const admin = await this.adminsService.get(username);
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            throw new HttpException(
                { message: 'You have entered an invalid username or password' },
                HttpStatus.NOT_FOUND,
            );
        }

        const payload = { sub: username };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
