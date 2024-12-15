import { Injectable } from '@nestjs/common';
import { UserService } from 'src/prisma/user/user.service';
import { ILogin } from 'src/interfaces/interface-auth';

@Injectable()
export class SignInService {
    constructor(private readonly userService: UserService) {}

    async loginUsers(body: ILogin) {
        const { username, email, password } = body;
        if (!password || (!email && !username)) {
            return {
                success: false,
                message: 'Email, Username and Password are required',
                data: {},
            };
        }

        const identifier = email || username;
        const user = await this.userService.findUserByIdentifier(identifier);
        if (!user) {
            return {
                success: false,
                message: 'User not found',
                data: {},
            };
        }

        const passwordMatch = await this.userService.comparePassword(password, user.password);
        if (!passwordMatch) {
            return {
                success: false,
                message: 'Invalid password',
                data: {},
            };
        }

        return {
            success: true,
            message: 'Login Successfully',
            data: {
                displayName: user.displayName,
                email: user.email,
                joinedAt: user.joinedAt,
            },
        };
    }
}
