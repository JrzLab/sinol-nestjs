import * as path from 'path';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
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

  @Get('download/:idFolder/:fileName')
  @ApiOperation({ summary: 'Download user file' })
  @ApiParam({ name: 'idFolder', type: 'string', description: 'Folder ID' })
  @ApiParam({ name: 'fileName', type: 'string', description: 'File Name' })
  @ApiResponse({ status: 200, description: 'File downloaded successfully' })
  downloadUserFile(@Param() params: { idFolder: string; fileName: string }, @Res() res: Response) {
    const filePath = path.join(__dirname, `../fileTasks/${params.idFolder}/${params.fileName}`);
    return res.download(filePath);
  }
}
