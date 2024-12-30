import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByIdentifier(where: { id?: number; firstName?: string; email?: string }) {
    const { email, firstName, id } = where;
    return this.prismaService.user.findMany({
      where: {
        OR: [id ? { id } : undefined, email ? { email } : undefined, firstName ? { firstName } : undefined].filter(Boolean),
      },
    });
  }

  async findUsersData() {
    return this.prismaService.user.findMany();
  }

  async create(data: { email: string; password: string; firstName: string, lastName?: string | null, imageUrl?: string | null }) {
    return this.prismaService.user.create({ data });
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

  async fetchUserOrCreateUser(data: { email: string; firstName: string; lastName?: string | null; imageUrl?: string | null }) {
    const existingUser = await this.findUserByIdentifier({ email: data.email });
    if (existingUser.length > 0) {
      return existingUser[0];
    }
    return this.create({ ...data, password: '' });
  }
}
