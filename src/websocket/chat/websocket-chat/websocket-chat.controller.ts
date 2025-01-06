import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetEmailDto } from 'src/dto/websocket/get-email-dto';
import { GetMessageDto } from 'src/dto/websocket/get-message-dto';
import { UserPrismaService } from 'src/prisma/userPrisma/user-prisma.service';
import { WebsocketPrismaService } from 'src/prisma/websocketPrisma/websocket-prisma.service';

@ApiTags('Websocket Chat')
@Controller('websocket/chat')
export class WebsocketChatController {
  constructor(
    private readonly userService: UserPrismaService,
    private readonly websocketService: WebsocketPrismaService,
  ) {}

  @Post('create')
  @ApiOperation({ summary: 'Create a new chat room' })
  @ApiBody({ type: GetEmailDto })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Room created successfully' })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Room creation failed because already exists' })
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
        success: true,
        message: 'Room created successfully',
        data: {
          id: roomData.id,
        },
      },
      HttpStatus.CREATED,
    );
  }

  @Get('history/:idRoom')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiParam({ name: 'idRoom', type: 'string', description: 'Room ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Chat history retrieved successfully' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat history not found' })
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
