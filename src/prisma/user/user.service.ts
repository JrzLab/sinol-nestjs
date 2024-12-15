import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserData(where: { id?: number; username?: string; email?: string }) {
    const { email, username, id } = where;
    return this.prismaService.user.findMany({
      where: {
        OR: [id ? { id } : undefined, email ? { email } : undefined, username ? { username } : undefined].filter(Boolean),
      },
    });
  }

  async findUserByIdentifier(identifier: string) {
    return await this.prismaService.user.findFirst({
        where: {
            OR: [
                { email: identifier },
                { username: identifier },
            ],
        },
    });
  }

  async findUsersData() {
    return this.prismaService.user.findMany();
  }

  async create(data: { email: string; password: string; username: string }) {
    return this.prismaService.user.create({ data: { ...data, displayName: data.email.split('@')[0] }});
  }
}
