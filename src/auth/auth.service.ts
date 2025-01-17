import { BadGatewayException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

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
    const existUser = await this.userService.findEmail(email);
    if (!existUser) {
      throw new BadGatewayException('Email not exist !! Please register');
    }
    const isMatch = await this.verifyPassword(password, existUser.password);
    if (!isMatch) {
      throw new BadGatewayException('Something wrong! Please try again');
    }
    const {access_token,refresh_token} = await this.GenerateToken(existUser.id,existUser.email)
    return {
      message: 'successfully sign in,...updating generate AT-RT',
      access_token,
      refresh_token,
    };
  }

  private async GenerateToken(userId:number,email:string){
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
    return {access_token,refresh_token}
  }

  async SignOut(userId: number) {
    return false;
  }

  async RefreshToken(userId: number) {
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
