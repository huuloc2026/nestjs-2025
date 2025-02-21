import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateAuthDto, UpdateAuthDto } from './dto';

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService, UserWithRole } from 'src/module/user/user.service';
import { randomUUID } from 'crypto';
import { User } from 'src/module/user/entities/user.entity';
import { JwtPayload } from 'src/auth/types';
import { CommonService } from 'src/common/common.service';
import { UpdateUserDto } from 'src/module/user/dto/update-user.dto';
import { ChangePasswordDTO } from 'src/module/seller/dto/ChangePasswordDTO';
import { UserTokensService } from 'src/module/user-tokens/user-tokens.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private userTokens: UserTokensService,
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
    const hashedPassword = await this.hashPassword(createAuthDto.password);
    const verifyCode: number = this.commonService.generateOTP(); //generate code
    await this.userService.createNewUser({
      ...createAuthDto,
      password: hashedPassword,
      verificationCode: verifyCode,
    }); //save verify code
    return `successfully register`;
  }

  async SignIn(User: { id: string; email: string }) {
    const { id, email } = User;
    const payload: JwtPayload = { sub: id, email: email };
    const { access_token, refresh_token } = await this.GenerateToken(payload);
    await this.userTokens.storeToken(id, access_token, refresh_token);

    return {
      message: 'successfully sign in,...updating generate AT-RT',
      access_token,
      refresh_token,
    };
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

  async verifyAccount(email: string, code: number) {
    const existUser = await this.userService.findOnebyEmail(email);
    if (existUser.isActive === true) {
      throw new ConflictException('You already verify');
    }
    if (code !== +existUser.verificationCode) {
      throw new ForbiddenException('verify code wrong! Please try again');
    }
    if (existUser.verificationCode === null && existUser.isActive === false) {
      throw new ForbiddenException('verify code wrong! Please try again');
    } // double check
    await this.userService.update(existUser.id, {
      isActive: true,
      verificationCode: null,
    });
    return {
      message: 'successfully verify',
    };
  }

  async ChangeInfor(user: UpdateUserDto, SomethingUpdate: any) {
    return await this.userService.updateInfor(user, SomethingUpdate);
  }

  private async GenerateToken(payload: JwtPayload) {
    const access_token = await this.generateAccessToken(payload);
    const refresh_token = await this.generateRefreshToken(payload);
    return { access_token, refresh_token };
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

  async ChangePassword(email: string, passwordBody: ChangePasswordDTO) {
    const existUser = await this.userService.findOnebyEmail(email);
    const { id, password } = existUser;
    const { oldPassword, newPassword } = passwordBody;
    if (!(await this.verifyPassword(oldPassword, password))) {
      throw new ConflictException('Wrongggg');
    }

    const newHashedpassword = await this.hashPassword(newPassword);
    await this.userService.update(id, {
      password: newHashedpassword,
    });
    await this.userTokens.removeToken(id);
    //create new key
    const { access_token, refresh_token } = await this.GenerateToken({
      sub:id,
      email: email,
    });
    await this.userTokens.storeToken(id, access_token, refresh_token);
    return { message:"'Successfully changed password'",access_token, refresh_token };
  }
  async UploadAvatar() {}

  async SignOut(id: string) {
    const check = await this.userTokens.checkKeyStore(id);
    if(!check){
      Logger.warn('Not found id to delete');
      throw new NotFoundException("Can not found")
    }
    await this.userTokens.removeToken(id)
    return 'Successfully log out password';
  }
  async handlerRefreshToken(user: any) {
    // delete old key
    const check = await this.userTokens.removeToken(user.id)

    //create new key 
    const { access_token,refresh_token } = await this.GenerateToken({
      sub: user.id,
      email: user.email,
    });
    await this.userTokens.storeToken(user.id, access_token,refresh_token);
    return { access_token, refresh_token };

    ///updating
    return true;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = this.configService.get<number>('SALT_ROUND');
    const salt = await bcrypt.genSalt(+saltRound);
    return await bcrypt.hash(password, salt);
  }

  // for RT guard
  async getUserIfRefreshTokenMatched(
    userId: string,
    refreshToken: string,
  ): Promise<any> {
    try {
      const user = await this.userService.findOneByCondition({
        id: userId,
      });
      if (!user) {
        throw new UnauthorizedException();
      }
      const checkRefreshTokenTrue = await this.userTokens.validateRefreshToken(
        userId,
        refreshToken,
      );
      if (!checkRefreshTokenTrue) {
        throw new UnauthorizedException();
      }
      return this.commonService.getEssentialUserData(user);
    } catch (error) {
      throw error;
    }
  }
  //save refresh Token to db
  async storeRefreshToken(id: string, token: string): Promise<void> {
    try {
      const saltRound = this.configService.get<number>('SALT_ROUND');
      const hashed_token = await bcrypt.hash(token, saltRound);
      await this.userService.setCurrentRefreshToken(id, hashed_token);
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

  async TestEndpoint(input: any) {
    return await this.userService.GetUserWithRole(input);
  }

  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  findAll() {
    return this.userService.findAll();
  }

  findOne(id: string) {
    return this.userService.findOne(id);
  }

  update(id: string, updateAuthDto: UpdateAuthDto) {
    return this.userService.update(id, updateAuthDto);
  }

  remove(id: string) {
    return this.userService.remove(id);
  }
}
