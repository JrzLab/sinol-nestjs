import * as fs from 'fs';
import * as sharp from 'sharp';
import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly userPrismaService: UserPrismaService) {}

  private async addProfilePicture(id: number, file: Express.Multer.File) {
    const profilePath = `./files/${id}/profile.webp`;
    const bufferImage = await sharp(file.buffer).webp({ quality: 100 }).toBuffer();
    fs.writeFileSync(profilePath, bufferImage);
    return `/file/${id}/profile.webp?download=0`;
  }

  async findAllUsers() {
    const usersData = await this.userPrismaService.findUsersData();
    return usersData.map(({ id, email, firstName, lastName, imageUrl }) => ({ id, email, firstName, lastName, imageUrl }));
  }

  async findUser(id?: string, email?: string) {
    const condition = id ? { id: Number(id) } : { email };
    const userData = await this.userPrismaService.findUserByIdentifier(condition);
    return { id: userData.id, email: userData.email, firstName: userData.firstName, lastName: userData.lastName, imageUrl: userData.imageUrl };
  }

  async changeProfilePicture(email: string, file: Express.Multer.File) {
    const userData = await this.userPrismaService.findUserByIdentifier({ email });
    const linkProfile = await this.addProfilePicture(userData.id, file);
    await this.userPrismaService.addProfilePicture({ email }, { imageUrl: linkProfile });
    return {
      linkProfile,
    };
  }
}
