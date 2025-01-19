import { HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IToken } from 'src/utility/interfaces/interface-auth';
import { AuthService } from 'src/auth/auth.service';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';

@Injectable()
export class ResetPasswordService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userPrismaService: UserPrismaService,
  ) {}

  async verifyToken(email: string, token: string) {
    try {
      const tokenData = await this.userPrismaService.findUserByIdentifier({ email });
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
      this.userPrismaService.deleteTokenReset({ email });
      return (
        verifyToken && {
          code: HttpStatus.OK,
          success: true,
          message: 'Success change password',
          data: {},
        }
      );
    } catch (error) {
      this.userPrismaService.deleteTokenReset({ email });
      return {
        code: HttpStatus.UNAUTHORIZED,
        success: false,
        message: `Token invalid : ${error}`,
        data: {},
      };
    }
  }

  async changePassword(email: string, password: string) {
    const userData = await this.userPrismaService.findUserByIdentifier({ email });

    if (!userData) return {};

    return this.userPrismaService.changePassword({ email }, { password });
  }
}
