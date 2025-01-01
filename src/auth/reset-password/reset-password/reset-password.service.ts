import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IToken, IVerifyToken } from 'src/utility/interfaces/interface-auth';
import { AuthService } from 'src/auth/auth.service';
import { UserPrismaService } from 'src/prisma/user/userPrisma.service';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly userService: UserPrismaService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async verifyToken(data: IVerifyToken) {
    const { email, token } = data;
    try {
      const tokenData = await this.userService.findUserByIdentifier({ email });
      if (!tokenData.tokenReset) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
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
          success: true,
          message: 'Success change password',
          data: {},
        }
      );
    } catch (error) {
      this.userService.deleteTokenReset({ email });
      return {
        code: HttpStatus.UNAUTHORIZED,
        success: false,
        message: `Token invalid : ${error}`,
        data: {},
      };
    }
  }
}
