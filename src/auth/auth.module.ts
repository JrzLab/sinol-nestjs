import { Module } from '@nestjs/common';
import { SignInModule } from './sign-in/sign-in.module';
import { SignUpModule } from './sign-up/sign-up.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RequestResetPassModule } from './request-reset-pass/request-reset-pass.module';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './jwtConstans';
import { LogoutModule } from './logout/logout.module';
import { SigninGoogleModule } from './signin-google/signin-google.module';
import { VerifyTokenResetPassModule } from './verify-token-reset-pass/verify-token-reset-pass.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          service: 'gmail',
          auth: {
            user: configService.get('EMAIL_USER'),
            pass: configService.get('EMAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `Sinol <no-reply@${configService.get('EMAIL_USER')}>`,
        },
      }),
    }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '30m' },
    }),
    PrismaModule,
    SignInModule,
    SignUpModule,
    LogoutModule,
    ResetPasswordModule,
    RequestResetPassModule,
    SigninGoogleModule,
    VerifyTokenResetPassModule,
  ],
  providers: [AuthService],
})
export class AuthModule {}
