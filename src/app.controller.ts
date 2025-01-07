import * as path from 'path';
import { Controller, Get, Param, Query, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Response } from 'express';

@ApiTags('App')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get Hello World' })
  getHello() {
    return this.appService.getHello();
  }

  @Get('file/:idFolder/:fileName')
  @ApiOperation({ summary: 'Download user file' })
  @ApiParam({ name: 'idFolder', type: 'string', description: 'Folder ID' })
  @ApiParam({ name: 'fileName', type: 'string', description: 'File Name' })
  @ApiQuery({ name: 'download', type: 'string', description: 'Download file' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  downloadUserFile(@Param() params: { idFolder: string; fileName: string }, @Query() query: { download: string }, @Res() res: Response) {
    const filePath = path.join(
      __dirname,
      `../files/${params.idFolder}/${params.fileName === 'profile.webp' ? 'profile.webp' : `tasks/${params.fileName}`}`,
    );
    return query.download === '1' ? res.download(filePath) : res.sendFile(filePath);
  }
}
