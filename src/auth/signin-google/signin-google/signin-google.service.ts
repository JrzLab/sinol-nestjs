import * as fs from 'fs';
import * as https from 'https';
import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { ISigninGoogle } from 'src/utility/interfaces/interface-auth';
import { user } from '@prisma/client';

@Injectable()
export class SigninGoogleService {
  constructor(private readonly userService: UserPrismaService) {}

  private async downloadAndSave(userData: user, url: string) {
    const folderPath = `./files/${userData.id}/tasks`;
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });
    const filePath = `./files/${userData.id}/profile.webp`;

    https.get(url, (response) => {
      if (response.statusCode === 200) {
      const chunks: Uint8Array[] = [];
      response.on('data', (chunk) => chunks.push(chunk));
      response.on('end', async () => {
        const buffer = Buffer.concat(chunks);
        const bufferImage = await sharp(buffer).webp({ quality: 100 }).toBuffer();
        fs.writeFileSync(filePath, bufferImage);
      });
      }
    });

    return `/file/${userData.id}/profile.webp?download=0`;
  }

  async fetchOrCreateUsers(data: ISigninGoogle) {
    const { email, firstName, lastName, imageUrl } = data;

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
        const user = await this.userService.fetchUserOrCreateUser({ email, firstName, lastName, imageUrl: "" });
        const linkProfile = await this.downloadAndSave(user, imageUrl);
        await this.userService.addProfilePicture({ email }, { imageUrl: linkProfile });

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
            imageUrl: linkProfile,
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
          firstName: userData.firstName,
          lastName: userData.lastName,
          imageUrl: userData.imageUrl,
          email: userData.email,
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
