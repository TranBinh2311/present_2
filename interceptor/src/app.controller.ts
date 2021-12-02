import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RegisterDto } from './app.dto';
import { throwError } from 'rxjs';
import {
  AuditLogInterceptor,
  ExceptionInterceptor,
  LoggingInterceptor,
  TimeoutInterceptor,
} from './auditlog.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseInterceptors(ExceptionInterceptor)
  getHello() {
    return throwError(() => new BadRequestException());
  }

  @Post()
  @UseInterceptors(AuditLogInterceptor)
  register(@Body() register: RegisterDto) {
    console.log(`Register parameters: ${JSON.stringify(register)}`);
    return 'This method adds a new user';
  }

  @Get('/timeout')
  @UseInterceptors(TimeoutInterceptor)
  async getTimeoutInterceptor() {
    await new Promise((r) => setTimeout(r, 500));
    return 'Congratulation!!!';
  }
}
