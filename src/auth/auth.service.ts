import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { CreateAuthDto, UpdateAuthDto } from './dto';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/module/user/user.service';
import { randomUUID } from 'crypto';
import { User } from 'src/module/user/entities/user.entity';
import { JwtPayload } from 'src/auth/types';
import { CommonService } from 'src/common/common.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private commonService: CommonService,
    private jwtService: JwtService,
  ) {}
  async SignUp(createAuthDto: CreateAuthDto) {
    const existed_user = await this.userService.findEmailNotExist(
      createAuthDto.email,
    );
    if (existed_user) {
      throw new ConflictException('Email already existed!!');
    }
    const hashedPassword = await this.hashPassword(createAuthDto.password)
    const verifyCode:number = this.commonService.generateOTP(); //generate code
    await this.userService.createNewUser({...createAuthDto,password:hashedPassword,verificationCode:verifyCode}); //save verify code
    return `successfully register`;
  }
  // like sign up 
  async getAuthenticatedUser(email: string, password: string): Promise<User> {
    try {
      const user = await this.userService.findOnebyEmail(email);
      await this.verifyPlainContentWithHashedContent(password, user.password);
      return user;
    } catch (error) {
      throw new BadRequestException('Wrong credentials!!');
    }
  }
  private async verifyPlainContentWithHashedContent(
    plain_text: string,
    hashed_text: string,
  ): Promise<boolean> {
    const is_matching: boolean = await bcrypt.compare(plain_text, hashed_text);
    if (!is_matching) {
      throw new BadRequestException();
    }
    return is_matching;
  }

  async SignIn(User: { id: number; email: string }) {
    const { id, email } = User;
    const payload: JwtPayload = { sub: id, email: email };
    const { access_token, refresh_token } = await this.GenerateTokenV2(payload);
    const hashToken = await this.hashPassword(refresh_token);
    await this.userService.update(id, {
      refreshToken: hashToken,
    });
    return {
      message: 'successfully sign in,...updating generate AT-RT',
      access_token,
      refresh_token,
    };
  }

  async verifyAccount(email: string, code: number) {
    const existUser = await this.userService.findOnebyEmail(email);
    if (existUser.isActive === true) {
      throw new ConflictException('You already verify');
    }
    if (code !== existUser.verificationCode) {
      throw new ForbiddenException('verify code wrong! Please try again');
    }
    if(existUser.verificationCode === null && existUser.isActive === false){
      throw new ForbiddenException('verify code wrong! Please try again');
    } // double check
    await this.userService.update(existUser.id,{isActive:true,verificationCode:null})
    return {
      message: 'successfully verify',
    };
  }

  generateAccessToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('AT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('AT_EXPIRE'),
    });
  }

  generateRefreshToken(payload: JwtPayload) {
    return this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>('RT_SECRET'),
      expiresIn: this.configService.getOrThrow<string>('RT_EXPIRE'),
    });
  }
  private async GenerateTokenV2(payload: JwtPayload) {
    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);
    return { access_token, refresh_token };
  }

  private async GenerateToken(userId: number, email: string) {
    const access_token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.getOrThrow<string>('AT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('AT_EXPIRE'),
      },
    );
    const refresh_token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.getOrThrow<string>('RT_SECRET'),
        expiresIn: this.configService.getOrThrow<string>('RT_EXPIRE'),
      },
    );
    return { access_token, refresh_token };
  }
  async VerifyToken(token: string, type: 'AT' | 'RT') {
    const decoded =
      type == 'AT'
        ? await this.jwtService.verify(token, {
            secret: this.configService.get<string>('AT_SECRET'),
          })
        : await this.jwtService.verify(token, {
            secret: this.configService.get<string>('RT_SECRET'),
          });
    return decoded;
  }
  async validateToken(token: string) {
    const decoded = await this.jwtService.verify(token, {
      secret: this.configService.get<string>('AT_SECRET'),
    });
    return decoded;
  }
  async RefreshToken(refreshToken: string) {
    const decoded = await this.VerifyToken(refreshToken, 'RT');
    if (!decoded) {
      throw new ForbiddenException('Something wrong');
    }
    const existUser = await this.userService.findOnebyEmail(decoded.email);
    if (!existUser) {
      throw new ForbiddenException('Access denied!!');
    }
    const { access_token, refresh_token } = await this.GenerateToken(
      decoded.id,
      decoded.email,
    );
    return { access_token, refresh_token };
  }

  async SignOut(email: string) {
    return true;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = this.configService.get<number>('SALT_ROUND');
    const salt = await bcrypt.genSalt(+saltRound);
    return await bcrypt.hash(password, salt);
  }

  async storeRefreshToken(user_id: number, token: string): Promise<void> {
    try {
       const saltRound = this.configService.get<number>('SALT_ROUND');
      const hashed_token = await bcrypt.hash(token, saltRound);
      await this.userService.setCurrentRefreshToken(user_id, hashed_token);
    } catch (error) {
      throw error;
    }
  }

  private async verifyPassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
