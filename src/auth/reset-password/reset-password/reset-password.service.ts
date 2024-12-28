import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IToken } from 'src/utility/interfaces/interface-auth';
import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/prisma/user/user.service';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async verifyToken(email: string, token: string) {
    try {
      const tokenData = await this.userService.findUserByIdentifier({ email });
      if (!tokenData.tokenReset) {
        return {
          code: HttpStatus.NOT_FOUND,
          status: false,
          message: 'Token not found or expired',
          data: {},
        };
      }

      const tokenValid = (await this.jwtService.verifyAsync(token)) as IToken;
      const verifyToken = this.authService.compareEncodeData(email, tokenValid.email);
      this.userService.deleteTokenReset({ email });
      return (
        verifyToken && {
          code: HttpStatus.OK,
          status: true,
          message: 'Success change password',
          data: {},
        }
      );
    } catch (error) {
      this.userService.deleteTokenReset({ email });
      return {
        code: HttpStatus.UNAUTHORIZED,
        status: false,
        message: `Token invalid : ${error}`,
        data: {},
      };
    }
  }
}
