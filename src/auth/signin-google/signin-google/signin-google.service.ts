import * as fs from 'fs';
import * as https from 'https';
import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { ISigninGoogle } from 'src/utility/interfaces/interface-auth';
import { user } from '@prisma/client';
import { AuthService } from 'src/auth/auth.service';

@Injectable()
export class SigninGoogleService {
  constructor(
    private readonly userPrismaService: UserPrismaService,
    private readonly authService: AuthService,
  ) {}

  private async downloadAndSave(userData: user, url: string) {
    const folderPath = `./files/${userData.id}/tasks`;
    const filePath = `./files/${userData.id}/profile.webp`;
    if (!fs.existsSync(folderPath)) fs.mkdirSync(folderPath, { recursive: true });

    https.get(url, (response) => {
      if (response.statusCode === 200) {
        const chunks: Uint8Array[] = [];
        response.on('data', (chunk) => chunks.push(chunk));
        response.on('end', async () => {
          const bufferImage = await sharp(Buffer.concat(chunks)).webp({ quality: 100 }).toBuffer();
          fs.writeFileSync(filePath, bufferImage);
        });
      }
    });

    return `/file/${userData.id}/profile.webp?download=0`;
  }

  async fetchOrCreateUsers(data: ISigninGoogle) {
    const { email, firstName, lastName, imageUrl } = data;
    if (!email || !firstName) {
      return { success: false, message: 'Email and First Name are required', data: {} };
    }

    try {
      let user = await this.userPrismaService.fetchUserOrCreateUser({ email, firstName, lastName, imageUrl: '' });
      const uClassData = await this.authService.addUidUserClass(email);
      if (!imageUrl.includes('/file/') && user.imageUrl === '') {
        const linkProfile = await this.downloadAndSave(user, imageUrl);
        user = await this.userPrismaService.addProfilePicture({ email }, { imageUrl: linkProfile });
      }

      if (!user) {
        return { success: false, message: 'Failed to create user', data: {} };
      }

      return {
        success: true,
        message: 'Login User Successfully',
        data: {
          uid: uClassData.uid.split('-')[0],
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
          email: user.email,
          joinedAt: user.createdAt,
          loginAt: Math.floor(Date.now() / 1000),
        },
      };
    } catch (error) {
      return { success: false, message: `An error occurred: ${error.message}`, data: {} };
    }
  }
}
