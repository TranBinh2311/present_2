import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { User } from './custom.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/user')
  createEmployee(@User('firstName') firstName: string) {
    //console.log(firstName);
    return firstName;
  }
}
