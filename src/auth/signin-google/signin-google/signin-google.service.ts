import { Injectable } from '@nestjs/common';
import { UserService } from 'src/prisma/user/user.service';
import { ISigninGoogle } from 'src/utility/interfaces/interface-auth';

@Injectable()
export class SigninGoogleService {
  constructor(private readonly userService: UserService) {}

  async fetchOrCreateUsers(data: ISigninGoogle) {
    const { email, firstName, imageUrl, lastName } = data;
    
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
      let user = userData[0];

      // Jika pengguna tidak ditemukan, buat pengguna baru
      if (!userData.length) {
        user = await this.userService.fetchUserOrCreateUser(data);

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
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          email: user.email,
          joinedAt: user.createdAt,
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
