import {
  Controller,
  Get,
  Query,
  UseGuards,
  Param,
  Put,
  Delete,
  Body,
} from '@nestjs/common';
import { AppService } from './app.service';
import { RbacRoles } from './role.decorator';
import { RbacRolesGuard } from './role.guard';

@UseGuards(RbacRolesGuard)
@Controller('profile')
export class AppController {
  @Get()
  @RbacRoles('admin', 'user', 'seller')
  findAll(@Query() query) {
    return `This endpoint returns all users (limit: ${query.limit} items)`;
  }
  @Get(':id')
  @RbacRoles('admin', 'user', 'seller')
  findOne(@Param('id') id: number) {
    return `This endpoint returns a #${id} user`;
  }
  @Get(':userName')
  @RbacRoles('admin', 'user', 'seller')
  async getUserDetails(@Param('userName') userName: string) {
    return 'returns user details';
  }
  @Put(':id')
  @RbacRoles('admin', 'user')
  update(@Param('id') id: string, @Body() updateProfileDto) {
    return `This endpoint updates a #${id} user`;
  }
  @Delete(':id')
  @RbacRoles('user')
  remove(@Param('id') id: string) {
    return `This endpoint removes a #${id} user`;
  }
}

export default AppController;
