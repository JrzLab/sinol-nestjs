import { Injectable, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/prisma/user/user.service';
import { AuthService } from 'src/auth/auth.service';
import { IToken, IVerifyToken } from 'src/utility/interfaces/interface-auth';

@Injectable()
export class VerifyTokenResetPassService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
  ) {}

  async verifyToken(data: IVerifyToken) {
    const { email, token } = data;

    if (!email || !token) {
      return {
        code: HttpStatus.BAD_REQUEST,
        success: false,
        message: 'Email and token are required',
        data: {},
      };
    }

    try {
      const [user] = await this.userService.findUserByIdentifier({ email });

      if (!user) {
        return {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found',
          data: {},
        };
      }

      if (!user.tokenReset) {
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
          message: 'Invalid or expired token',
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
