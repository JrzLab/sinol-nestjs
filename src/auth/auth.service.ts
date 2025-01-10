import * as base32 from 'base32';
import * as bcrypt from 'bcryptjs';
import { Injectable } from '@nestjs/common';
import { userClass } from '@prisma/client';
import { ClassPrismaService } from 'src/prisma/classPrisma/class-prisma.service';

@Injectable()
export class AuthService {
  constructor(private readonly classPrismaService: ClassPrismaService) {}

  async addUidUserClass(email: string): Promise<userClass> {
    const uClassData = await this.classPrismaService.getUClass({ email });
    if (!uClassData) {
      await this.classPrismaService.addUClass({ email });
      return this.addUidUserClass(email);
    }
    return uClassData;
  }

  async hashText(text: string) {
    return bcrypt.hash(text, 15);
  }

  async compareHashText(text: string, hash: string) {
    return bcrypt.compare(text, hash);
  }

  encodeData(data: string): string {
    const hexCode = Buffer.from(data).toString('hex');
    const base32Code = base32.encode(hexCode);
    const base64Code = Buffer.from(base32Code).toString('base64');
    return base64Code;
  }

  compareEncodeData(data: string, buffer: string): boolean {
    const reEncode = this.encodeData(data);
    return reEncode === buffer;
  }
}
