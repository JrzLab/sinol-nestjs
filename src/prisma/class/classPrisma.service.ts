import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ClassPrismaService {
  constructor(private readonly prismaService: PrismaService) {}

  async addClass(user: { email: string; userClassUid: string }) {
    return this.prismaService.groupClass.create({
      data: {
        className: 'Class 1',
        discription: 'This is class 1',
        owner: {
          connect: {
            email: user.email,
          },
        },
        userClass: {
          connect: {
            uid: user.userClassUid,
          },
        },
      },
    });
  }

  async getClass(user: { email: string }) {
    return await this.prismaService.userClass.findFirst({
      where: { user },
      include: {
        groupClass: {
          select: {
            id: true,
            discription: true,
            owner: { select: { email: true } },
          },
        },
      },
    });
  }
}
