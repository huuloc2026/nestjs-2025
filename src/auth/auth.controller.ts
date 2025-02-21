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
  Put,
  ConflictException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  AuthSignupDto,
  CreateAuthDto,
  UpdateAuthDto,
  VerifyDTO,
} from 'src/auth/dto';

import { TransformInterceptor } from 'src/common/interceptor/transform.interceptor';
import { Public } from 'src/common/decorators';

import {
  AtGuard,
  LocalAuthGuard,
  RolesGuard,
  RtGuard,
} from 'src/common/guards';
import { Roles } from 'src/common/decorators/role.decorator';
import { ROLE } from 'src/module/user/enum/EUser';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { ChangeInforUserDTO } from 'src/module/seller/dto/ChangeInforDTO';
import { ChangePasswordDTO } from 'src/module/seller/dto/ChangePasswordDTO';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/signup')
  @ApiOperation({
    summary: 'Admin create new user',
    description: `
    * Only admin can use this API
    * Admin create user and give some specific information`,
  })
  @ApiBearerAuth('JWT-auth')
  @ApiBody({
    type: CreateAuthDto,
    examples: {
      user_1: {
        value: {
          email: 'johndoe@example.com',
          password: '1232@asdS',
        } as CreateAuthDto,
      },
      user_2: {
        value: {
          email: 'michaelsmith@example.com',
          password: '1232@asdS',
        } as CreateAuthDto,
      },
    },
  })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Bad Request' })
  @ApiResponse({ status: HttpStatus.UNAUTHORIZED, description: 'Unauthorized' })
  @HttpCode(HttpStatus.CREATED)
  @Public()
  @UseInterceptors(TransformInterceptor)
  SignUp(@Body() newUser: CreateAuthDto) {
    return this.authService.SignUp(newUser);
  }

  @Post('signin')
  @Public()
  @UseGuards(LocalAuthGuard)
  @HttpCode(HttpStatus.OK)
  SignIn(@Req() request) {
    const { user } = request;
    return this.authService.SignIn(user);
  }

  @Post('verify')
  @HttpCode(HttpStatus.ACCEPTED)
  verify(@Req() request, @Body('code') code: VerifyDTO) {
    return this.authService.verifyAccount(request.user['email'], Number(code));
  }

  @Post('signout')
  @HttpCode(HttpStatus.ACCEPTED)
  logout(@Req() request): Promise<any> {
    return this.authService.SignOut(request.user['id']);
  }

  @Post('refreshtoken')
  @Public()
  @UseGuards(RtGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  RefreshToken(
    @Req() request: any,
  ): Promise<any> {
    const { user } = request;
    return this.authService.handlerRefreshToken(user);
  }

  @Put('updateInfor')
  @HttpCode(HttpStatus.CREATED)
  UpdateInfor(
    @Req() request: any,
    @Body() SomethingUpdate: ChangeInforUserDTO,
  ): Promise<any> {
    return this.authService.ChangeInfor(request.user, SomethingUpdate);
  }

  @Post('changepassword')
  @HttpCode(HttpStatus.CREATED)
  ChangePassword(
    @Req() request: any,
    @Body() SomethingUpdate: ChangePasswordDTO,
  ): Promise<any> {
    if (SomethingUpdate.newPassword !== SomethingUpdate.confirmPassword) {
      throw new ConflictException('Please try agains');
    }
    return this.authService.ChangePassword(
      request.user['email'],
      SomethingUpdate,
    );
  }

  @Post('testEndpointAT')
  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  @HttpCode(HttpStatus.ACCEPTED)
  TestEndPointAT(@Req() request: any) {
    const { user } = request;
    const test = this.authService.TestEndpoint(user.email);
    return test;
  }

  @Post()
  create(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.create(createAuthDto);
  }

  @Get()
  @Roles(ROLE.ADMIN)
  @UseGuards(RolesGuard)
  findAll() {
    return this.authService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.authService.remove(id);
  }
}
