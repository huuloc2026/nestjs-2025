import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  UseInterceptors,
  Req,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto, CreateAuthDto, UpdateAuthDto } from 'src/auth/dto';

import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { Public } from 'src/common/decorators';

import { RtGuard } from 'src/common/guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @UseInterceptors(TransformInterceptor)
  SignUp(@Body() newUser: CreateAuthDto) {
    return this.authService.SignUp(newUser);
  }

  @Post('/signin')
  @Public()
  @HttpCode(HttpStatus.OK)
  SignIn(@Body() newUser: AuthSignupDto) {
    return this.authService.SignIn(newUser);
  }

  @Post('verify')
  @HttpCode(HttpStatus.ACCEPTED)
  verify(@Req() req, @Body('code') code: number) {
    return this.authService.verifyAccount(req.user['email'], code);
  }

  @Post('logout')
  @HttpCode(HttpStatus.ACCEPTED)
  logout(@Body() email: string): Promise<boolean> {
    return this.authService.SignOut(email);
  }

  @Post('refreshtoken')
  @HttpCode(HttpStatus.ACCEPTED)
  RefreshToken(@Body() { refreshToken }: any): Promise<any> {
    return this.authService.RefreshToken(refreshToken);
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(+id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(+id);
  }
}
