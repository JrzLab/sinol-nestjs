import { Body, Controller, Get, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMessageDto } from 'src/dto/websocket/get-message-dto';
import { WebsocketPrismaService } from 'src/prisma/websocketPrisma/websocket-prisma.service';

@ApiTags('Websocket Chat')
@Controller('websocket/chat')
export class WebsocketChatController {
  constructor(private readonly websocketPrismaService: WebsocketPrismaService) {}

  @Post('history')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiBody({ type: GetMessageDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Chat history retrieved successfully' })
  async getChatHistory(@Body() data: GetMessageDto) {
    const { emailUser1, emailUser2 } = data;
    const chatHistory = await this.websocketPrismaService.getMessageAndChatRoom({ emailUser1, emailUser2 });

    throw new HttpException(
      {
        code: HttpStatus.OK,
        status: true,
        message: 'Chat history retrieved successfully',
        data: chatHistory,
      },
      HttpStatus.OK,
    );
  }

  // @Get('history/:idRoom')
  // @ApiOperation({ summary: 'Get chat history' })
  // @ApiParam({ name: 'idRoom', type: 'string', description: 'Room ID' })
  // @ApiResponse({ status: HttpStatus.OK, description: 'Chat history retrieved successfully' })
  // @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Chat history not found' })
  // async getChatHistory(@Param() data: GetMessageDto) {
  //   const { idRoom } = data;
  //   const chatHistory = await this.websocketPrismaService.getMessageAndChatRoom({ id: Number(idRoom) });

  //   throw new HttpException(
  //     {
  //       code: chatHistory ? HttpStatus.OK : HttpStatus.NOT_FOUND,
  //       status: !!chatHistory,
  //       message: chatHistory ? 'Chat history retrieved successfully' : 'Chat history not found',
  //       data: chatHistory ? chatHistory : {},
  //     },
  //     chatHistory ? HttpStatus.OK : HttpStatus.NOT_FOUND,
  //   );
  // }
}
