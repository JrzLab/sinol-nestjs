import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { AuthService } from 'src/auth/auth.service';
import { IToken } from 'src/utility/interfaces/interface-auth';

@Injectable()
export class VerifyTokenResetPassService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly userPrismaService: UserPrismaService,
  ) {}

  async verifyToken(email: string, token: string) {
    if (!email || !token) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Email and token are required',
        data: {},
      };
    }

    try {
      const userData = await this.userPrismaService.findUserByIdentifier({ email });

      if (!userData) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found',
          data: {},
        };
      }

      if (!userData.tokenReset) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'Token not found or expired',
          data: {},
        };
      }

      let tokenValid: IToken;
      try {
        tokenValid = await this.jwtService.verifyAsync(token);
      } catch (error) {
        return {
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Invalid or expired token' + error.message,
          data: {},
        };
      }

      const isTokenValid = this.authService.compareEncodeData(email, tokenValid.email);

      if (!isTokenValid) {
        return {
          code: HttpStatus.UNAUTHORIZED,
          success: false,
          message: 'Token does not match the user email',
          data: {},
        };
      }

      return {
        code: HttpStatus.OK,
        success: true,
        message: 'Token is valid',
        data: {},
      };
    } catch (error) {
      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        success: false,
        message: `An unexpected error occurred: ${error.message}`,
        data: {},
      };
    }
  }
}
