import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { GetEmailDto } from 'src/dto/websocket/get-email-dto';
import { GetMessageDto } from 'src/dto/websocket/get-message-dto';
import { UserService } from 'src/prisma/user/user.service';
import { WebsocketService } from 'src/prisma/websocket/websocket.service';

@Controller('websocket/chat')
export class WebsocketChatController {
  constructor(
    private readonly userService: UserService,
    private readonly websocketService: WebsocketService,
  ) {}

  @Post('create')
  async createChatRoom(@Body() data: GetEmailDto) {
    const { identifySender, identifyReciver } = data;

    const userExistSender = await this.userService.findUserByIdentifier({ email: identifySender });
    const userExistReciver = await this.userService.findUserByIdentifier({ email: identifyReciver });

    if (!userExistSender || !userExistReciver) {
      throw new HttpException(
        {
          code: HttpStatus.NOT_FOUND,
          success: false,
          message: 'User not found',
          data: {},
        },
        HttpStatus.NOT_FOUND,
      );
    }

    const roomData = await this.websocketService.createRoom({ emailUser1: identifySender, emailUser2: identifyReciver });
    throw new HttpException(
      {
        code: HttpStatus.CREATED,
        status: true,
        message: 'Room created successfully',
        data: {
          id: roomData.id,
        },
      },
      HttpStatus.CREATED,
    );
  }

  @Get('history/:idRoom')
  async getChatHistory(@Param() data: GetMessageDto) {
    const { idRoom } = data;
    const chatHistory = await this.websocketService.getMessageAndChatRoom({ id: Number(idRoom) });

    throw new HttpException(
      {
        code: chatHistory ? HttpStatus.OK : HttpStatus.NOT_FOUND,
        status: !!chatHistory,
        message: chatHistory ? 'Chat history retrieved successfully' : 'Chat history not found',
        data: chatHistory ? chatHistory : {},
      },
      chatHistory ? HttpStatus.OK : HttpStatus.NOT_FOUND,
    );
  }
}
