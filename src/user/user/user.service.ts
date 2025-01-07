import * as fs from 'fs';
import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { fileProfile } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private readonly userPrismaService: UserPrismaService) {}

  private formatDataProfile({ fileName, url }: fileProfile) {
    return { fileName, url };
  }

  private async addProfilePicture(id: number, file: Express.Multer.File) {
    const profilePath = `./files/${id}/profile.webp`;
    const bufferImage = await sharp(file.buffer).webp({ quality: 100 }).toBuffer();
    fs.writeFileSync(profilePath, bufferImage);
    return profilePath;
  }

  async findAllUsers() {
    const usersData = await this.userPrismaService.findUsersData();
    return usersData.map(({ id, email, firstName }) => ({ id, email, firstName }));
  }

  async findUser(id?: string, email?: string) {
    const condition = id ? { id: Number(id) } : { email };
    const userData = await this.userPrismaService.findUserByIdentifier(condition);
    return { id: userData.id, email: userData.email, firstName: userData.firstName };
  }

  async getChangeProfile(id: string) {
    const fileData = await this.userPrismaService.getProfilePicture({ id: Number(id) });
    return this.formatDataProfile(fileData);
  }

  async changeProfilePicture(email: string, file: Express.Multer.File) {
    const userData = await this.userPrismaService.findUserByIdentifier({ email });
    const fileName = await this.addProfilePicture(userData.id, file);
    const fileData = await this.userPrismaService.addProfilePicture(
      { email },
      { fileName, imageUrl: `/file/${userData.id}/profile.webp?download=0` },
    );
    return this.formatDataProfile(fileData);
  }
}
