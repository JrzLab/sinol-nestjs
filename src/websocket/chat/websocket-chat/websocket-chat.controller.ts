import { Body, Controller, Get, HttpException, HttpStatus, Param, Post } from '@nestjs/common';
import { ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetMessageAdminDto } from 'src/dto/websocket/get-message-admin-dto';
import { GetMessageDto } from 'src/dto/websocket/get-message-dto';
import { WebsocketChatService } from './websocket-chat.service';
import { GetMessageIDDto } from 'src/dto/websocket/get-message-id-dto';

@ApiTags('Websocket Chat')
@Controller('websocket/chat')
export class WebsocketChatController {
  constructor(private readonly websocketChatService: WebsocketChatService) {}

  @Post('history')
  @ApiOperation({ summary: 'Get chat history' })
  @ApiBody({ type: GetMessageDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Chat history retrieved successfully' })
  async getChatHistory(@Body() data: GetMessageDto) {
    const { emailUser1, emailUser2 } = data;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Chat history retrieved successfully',
        data: await this.websocketChatService.getChatHistoryMessage(emailUser1, emailUser2),
      },
      HttpStatus.OK,
    );
  }

  @Post('admin/history')
  @ApiOperation({ summary: 'Get chat history for admin' })
  @ApiBody({ type: GetMessageAdminDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'Chat history retrieved successfully' })
  async getChatHistoryForAdmin(@Body() data: GetMessageAdminDto) {
    const { emailUser1, groupClassUid } = data;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Chat history retrieved successfully',
        data: { messageData: await this.websocketChatService.getContactHistory(emailUser1, groupClassUid) },
      },
      HttpStatus.OK,
    );
  }

  @Get('admin/history-chat/:id')
  @ApiOperation({ summary: 'Get chat history by ID' })
  @ApiParam({ name: 'id', type: 'string' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Chat history retrieved successfully' })
  async getChatHistoryById(@Param() params: GetMessageIDDto) {
    const { id } = params;
    throw new HttpException(
      {
        code: HttpStatus.OK,
        success: true,
        message: 'Chat history retrieved successfully',
        data: { historyData: await this.websocketChatService.getChatHistoryById(Number(id)) },
      },
      HttpStatus.OK,
    );
  }
}
