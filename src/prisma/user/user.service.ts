import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserData(where: { id: number }) {
    const [userData] = await this.prismaService.user.findMany({ where });
    return userData;
  }

  async findUsersData() {
    return this.prismaService.user.findMany();
  }
}
