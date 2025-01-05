import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDto } from './dto/AuthRegisterDTO';
import { LoginDTO } from './dto/LoginDTO';
import { AuthInterceptor } from './interceptor/auth.interceptor';
import { CacheInterceptor } from '@nestjs/cache-manager';

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
    console.log('run here');
    return this.authService.signin(body)
  }
  @Post('signout')
  signout(@Body() body) {
    return this.authService.signout
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
