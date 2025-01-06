import { Injectable } from '@nestjs/common';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';

@Injectable()
export class UserService {
  constructor(private readonly userPrismaService: UserPrismaService) {}

  async findAllUsers() {
    const usersData = await this.userPrismaService.findUsersData();
    return usersData.map(({ id, email, firstName }) => ({ id, email, firstName }));
  }

  async findUser(id?: string, email?: string) {
    const condition = id ? { id: Number(id) } : { email };
    const userData = await this.userPrismaService.findUserByIdentifier(condition);
    return { id: userData.id, email: userData.email, firstName: userData.firstName };
  }
}
