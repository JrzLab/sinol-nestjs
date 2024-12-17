import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByIdentifier(where: { id?: number; username?: string; email?: string }) {
    const { email, username, id } = where;
    return this.prismaService.user.findMany({
      where: {
        OR: [id ? { id } : undefined, email ? { email } : undefined, username ? { username } : undefined].filter(Boolean),
      },
    });
  }

  async findUsersData() {
    return this.prismaService.user.findMany();
  }

  async create(data: { email: string; password: string; username: string }) {
    return this.prismaService.user.create({ data: { ...data, displayName: data.email.split('@')[0] } });
  }

  async changePassword(where: { email: string }, data: { password: string }) {
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  async addTokenReset(where: { email: string }, data: { tokenReset: string }) {
    return this.prismaService.user.update({
      where,
      data,
    });
  }

  async deleteTokenReset(where: { email: string }) {
    return this.prismaService.user.update({
      where,
      data: { tokenReset: null },
    });
  }
}
