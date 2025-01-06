import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { ISigninGoogle } from 'src/utility/interfaces/interface-auth';

@Injectable()
export class SigninGoogleService {
  constructor(private readonly userService: UserPrismaService) {}

  async fetchOrCreateUsers(data: ISigninGoogle) {
    const { email, firstName } = data;

    // Validasi input
    if (!email || !firstName) {
      return {
        success: false,
        message: 'Email and First Name are required',
        data: {},
      };
    }

    try {
      // Mencari pengguna berdasarkan email
      const userData = await this.userService.findUserByIdentifier({ email });

      // Jika pengguna tidak ditemukan, buat pengguna baru
      if (!userData) {
        const user = await this.userService.fetchUserOrCreateUser(data);

        if (!user) {
          return {
            success: false,
            message: 'Failed to create user',
            data: {},
          };
        }

        return {
          success: true,
          message: 'User Created Successfully',
          data: {
            firstName: user.firstName,
            lastName: user.lastName,
            imageUrl: user.imageUrl,
            email: user.email,
            joinedAt: user.createdAt,
            loginAt: Math.floor(Date.now() / 1000),
          },
        };
      }

      // Jika pengguna ditemukan, lakukan login
      return {
        success: true,
        message: 'Login Successfully',
        data: {
          joinedAt: userData.createdAt,
          loginAt: Math.floor(Date.now() / 1000),
        },
      };
    } catch (error) {
      return {
        success: false,
        message: `An error occurred: ${error.message}`,
        data: {},
      };
    }
  }
}
