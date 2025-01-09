import { BadGatewayException, BadRequestException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthRegisterDto } from './dto/AuthRegisterDTO';
import * as bcrypt from 'bcrypt'
import { fnGenerateSecretKey, fnGenerateVerifyCode, fnHashpassword, fnVerifyPassword, } from 'src/utils/auth.util';
import { LoginDTO } from './dto/LoginDTO';
import { JwtService } from '@nestjs/jwt';
import { expiredAT, expiredRF, JWTSECRET } from 'src/utils/CONSTANTS';
import { randomUUID } from 'crypto';
import { AuthResponseDTO } from './dto/AuthResponseDTO';
import { ChangePasswordDTO } from './dto/ChangePasswordDTO';
import { UpdateInfoDTO } from './dto/UpdateInforDTO';
import { IUpdateInfor } from './interfaces/IUpdateInfor';
import { UsersService } from 'src/users/users.service';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UsersService,
    private readonly commonService: CommonService
  ) {}

  async signup(dto: AuthRegisterDto) {
    const { email, name, password } = dto
    const findUser = await this.userService.getUserByEmail(email)
    if (findUser) throw new HttpException("Email already exist",HttpStatus.UNAUTHORIZED)
    // Hash the password
    const hashedpassword = await this.HashPassword(password)
    // Generate verification code
    const verifyCode = fnGenerateVerifyCode()
    const uuid = randomUUID()
    // // generate public key 
    const test = await this.prisma.user.create({
      data: {
        email, name, password: hashedpassword, verificationCode: verifyCode,
        secretKey: uuid
      } 
    }
    )
    return { data: test, messages: "oke signup successfully" }
  }
  async verify(dto: { email: string; code: string }){
    const { email, code } = dto;
    if (!email || !code) throw new NotFoundException('Email/Code not found');
    // Check email
    const user = await this.userService.getUserByEmail(email)
    if (!user) throw new NotFoundException('Email not found');

    // Check email is verifed 
    if (user.isVerified) throw new BadRequestException('Account already verified');

    // Check code
    if (user.verificationCode !== code) throw new BadRequestException('Invalid verification code');

    // update
    await this.prisma.user.update({
      where: { email },
      data: {
        isVerified: true,
        verificationCode: null, 
      },
    });

    return {
      messages: 'Account successfully verified',
      data: {
        email: user.email,
        name: user.name,
      },
    };
  }
  async signin(body: LoginDTO) {
    const { email, password } = body
    // Check if the email exists
    const findUser = await this.userService.getUserByEmail(email)
    if (!findUser) throw new HttpException("Email not found",HttpStatus.NOT_FOUND)
    // verify password
    const validPassword = await this.VerifyPassword(password, findUser.password)
    if (!validPassword) throw new HttpException("Password incorret, Please try again", HttpStatus.UNAUTHORIZED)
    if (findUser.isVerified === false) throw new HttpException("Account is not verified",HttpStatus.UNAUTHORIZED);
    // generate JWT
    const payload = {
      id: findUser.id,
      email: findUser.email
    }
    const { accessToken, refreshToken } = await this.generateTokens(payload);
    return { ...findUser,accessToken,refreshToken}
    
  }
  async updateInfo(body: IUpdateInfor){
    console.log(body);
    
    return `update oke`

  }
  async signout() {
    return { messages: "oke signout successfully" }
  }
  async VerifyAccount(dto: any) {
    return { messages: "oke VerifyAccount successfully" }
  }

  async ChangePassword(data: ChangePasswordDTO){
    const {oldPassword,confirmPassword,newPassword} = data 
    console.log(data);
    return { messages: "oke ChangePassword successfully" }
  }


  async refreshTokens(refreshToken: string) {
    try {
      const decoded = await this.jwt.verifyAsync(refreshToken, { secret: JWTSECRET });
      // If valid, generate new access token
      const { accessToken, refreshToken: newRefreshToken } = await this.generateTokens({ id: decoded.id, email: decoded.email });

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      throw new BadRequestException('Invalid or expired refresh token');
    }
  }


  private async generateTokens(payload: { id: string | number, email: string }) {
    const accessToken = await this.jwt.signAsync(payload, { secret: JWTSECRET, expiresIn: expiredAT });
    const refreshToken = await this.jwt.signAsync(payload, { secret: JWTSECRET, expiresIn: expiredRF });
    return { accessToken, refreshToken };
  }

  async HashPassword(password: string): Promise<string> {
    const saltRound = 10
    return await bcrypt.hash(password, saltRound)
  }
  async VerifyPassword(password: string, hashedpassword: string): Promise<boolean> {
    const isMatch = await bcrypt.compare(password, hashedpassword);
    return isMatch;
  }





  // create(createAuthDto: CreateAuthDto) {
  //   return 'This action adds a new auth';
  // }

  // findAll() {
  //   return `This action returns all auth`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} auth`;
  // }

  // update(id: number, updateAuthDto: UpdateAuthDto) {
  //   return `This action updates a #${id} auth`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} auth`;
  // }
}
