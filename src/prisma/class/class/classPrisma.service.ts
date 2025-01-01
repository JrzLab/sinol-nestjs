import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  async getClass(email: string) {
    return await this.prismaService.userClass.findFirst({
      where: {
        user: {
          email: email,
        },
      },
      include: {
        groupClas: true,
      },
    });
  }
}
