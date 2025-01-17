import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthSignupDto, CreateAuthDto, UpdateAuthDto } from 'src/auth/dto';
import { Tokens } from 'src/auth/types';
import { LoggingInterceptor } from 'src/common/interceptor/logging.interceptor';
import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(TransformInterceptor)
  SignUp(@Body() newUser: CreateAuthDto) {
    return this.authService.SignUp(newUser);
  }
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  SignIn(@Body() newUser: AuthSignupDto) {
    // :Promise<Tokens>
    return this.authService.SignIn(newUser);
  }

  @Post('logout')
  @HttpCode(HttpStatus.ACCEPTED)
  logout(userId: number): Promise<boolean> {
    return this.authService.SignOut(userId);
  }

  @Post('refreshtoken')
  @HttpCode(HttpStatus.ACCEPTED)
  RefreshToken(userId: number): Promise<boolean> {
    return this.authService.RefreshToken(userId);
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
