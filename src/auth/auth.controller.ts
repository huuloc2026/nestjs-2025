import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, Put } from '@nestjs/common';
import { AuthService } from './auth.service';


import { AuthRegisterDto } from './dto/AuthRegisterDTO';
import { LoginDTO } from './dto/LoginDTO';
import { AuthInterceptor } from './interceptor/auth.interceptor';

import { ChangePasswordDTO } from './dto/ChangePasswordDTO';
import { UpdateInfoDTO } from './dto/UpdateInforDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService,
  ) {}

  @Post('signup')
  signup(@Body() body:AuthRegisterDto){
    return this.authService.signup(body)
  }
  @Post('verify')
  verify(@Body() body:{ email: string; code: string }) {
    return this.authService.verify(body)
  }
  @Post('signin') 
  @UseInterceptors(AuthInterceptor)
  signin(@Body() body: LoginDTO) {
    return this.authService.signin(body)
  }

  @Put('update')
  update(@Body() body: UpdateInfoDTO){
    return this.authService.updateInfo(body)
  }

  @Post('changepassword')
  changePassword(@Body() body: ChangePasswordDTO) {
    return this.authService.ChangePassword(body)
  }

  @Post('signout')
  signout(@Body() body) {
    return this.authService.signout()
  }

  // @Post()
  // create(@Body() createAuthDto: CreateAuthDto) {
  //   return this.authService.create(createAuthDto);
  // }

  // @Get()
  // findAll() {
  //   return this.authService.findAll();
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.authService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
  //   return this.authService.update(+id, updateAuthDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.authService.remove(+id);
  // }
}
