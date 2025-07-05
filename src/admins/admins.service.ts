import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminsService {
    constructor(private readonly db: DatabaseService) {}

    async create(username: string, password: string) {
        if (await this.get(username)) {
            throw new HttpException(
                {
                    message: 'Username is taken',
                },
                HttpStatus.BAD_REQUEST,
            );
        }

        const salt = await bcrypt.genSalt();
        const hashed_password = await bcrypt.hash(password, salt);

        await this.db.admin.create({
            data: {
                username: username,
                password: hashed_password,
            },
        });
    }

    async get(username: string) {
        return await this.db.admin.findUnique({ where: { username } });
    }
}
