import * as fs from 'fs';
import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { IUserData } from 'src/utility/interfaces/interface-auth';
import { UserService } from 'src/prisma/user/user.service';

@Injectable()
export class RequestResetPassService {
  constructor(
    private readonly userService: UserService,
    private readonly mailService: MailerService,
  ) {}

  async sendEmail([userData]: IUserData[], jwtToken: string) {
    this.userService.addTokenReset({ email: userData.email }, { tokenReset: jwtToken });

    let htmlContent = fs.readFileSync('./view/resetPassword.html', 'utf-8');
    htmlContent = htmlContent
      .replace(/{{name}}/g, `${userData.lastName ? `${userData.firstName} ${userData.lastName}` : userData.firstName}`)
      .replace(/\[Product Name\]/g, 'Sinol')
      .replace(/\{{action_url}}/g, `http://localhost:3000/auth/forgot-password?profile=${jwtToken}&userId=${userData.email}`);

    await this.mailService.sendMail({
      to: userData.email, // list of receivers
      subject: 'Reset Password', // Subject line
      html: htmlContent, // html body
    });
  }
}
