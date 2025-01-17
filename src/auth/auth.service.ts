import { BadGatewayException, ForbiddenException, Injectable } from '@nestjs/common';
import { CreateAuthDto, UpdateAuthDto } from './dto';
 

import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/module/user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  async SignUp(createAuthDto: CreateAuthDto) {
    const hashedPassword = await this.hashPassword(createAuthDto.password);
    return await this.userService.create({
      ...createAuthDto,
      password: hashedPassword,
    });
  }
  async SignIn(User: { email: string; password: string }) {
    const { email, password } = User;
    const existUser = await this.userService.findOnebyEmail(email);
    if (!existUser) {
      throw new ForbiddenException('Access denied!!');
    }
    const isMatch = await this.verifyPassword(password, existUser.password);
    if (!isMatch) {
      throw new ForbiddenException('Something wrong! Please try again');
    }
    const { access_token, refresh_token } = await this.GenerateToken(
      existUser.id,
      existUser.email,
    );
    const hashToken = await this.hashPassword(refresh_token);
    //save refresh Token -> db
    await this.userService.update(existUser.id, {
      ...existUser,
      refreshToken: hashToken,
    });
    return {
      message: 'successfully sign in,...updating generate AT-RT',
      access_token,
      refresh_token,
    };
  }

  private async GenerateToken(userId: number, email: string) {
    const access_token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.get<string>('AT_SECRET'),
        expiresIn: this.configService.get<string>('AT_EXPIRE'),
      },
    );
    const refresh_token = await this.jwtService.signAsync(
      {
        sub: userId,
        email,
      },
      {
        secret: this.configService.get<string>('RT_SECRET'),
        expiresIn: this.configService.get<string>('RT_EXPIRE'),
      },
    );
    return { access_token, refresh_token };
  }
  private async VerifyToken(token:string,type:'AT'|'RT'){
    const decoded =
      type == 'AT'
        ? await this.jwtService.verify(token, {
            secret: this.configService.get<string>('AT_SECRET'),
          })
        : await this.jwtService.verify(token, {
            secret: this.configService.get<string>('RT_SECRET'),
          });
    return decoded
  }

  
  async RefreshToken(refreshToken: string) {
    const decoded = await this.VerifyToken(refreshToken,'RT')
    if(!decoded){throw new ForbiddenException("Something wrong")}
    const existUser = await this.userService.findOnebyEmail(decoded.email);
    if (!existUser) {
      throw new ForbiddenException('Access denied!!');
    }
    const { access_token, refresh_token } = await this.GenerateToken(decoded.id,decoded.email)
    return { access_token, refresh_token };
  }
  
  
  async SignOut(userId: number) {
    return false;
  }

  private async hashPassword(password: string): Promise<string> {
    const saltRound = this.configService.get<number>('SALT_ROUND');
    const salt = await bcrypt.genSalt(+saltRound);
    return await bcrypt.hash(password, salt);
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
