import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { UpdateInfoDTO } from 'src/auth/dto/UpdateInforDTO';
import { IUpdateInfor } from 'src/auth/interfaces/IUpdateInfor';
import { PrismaService } from 'src/prisma/prisma.service';

type IUser = {
  name?:true,
  email:true,
  password?:true
}

@Injectable()
export class UsersService {
    constructor(private readonly prisma: PrismaService) { }

  public async getUserById(id: number): Promise<any> {
    return this.prisma.user.findUnique({
      where: { id },
    });
  }
  public async getUserByEmail(email: string): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  public async getUserfilterSelect(email: string, select: IUser): Promise<any> {
    return this.prisma.user.findUnique({
      where: { email },
      select: select,
    });
  }

  public async updateUser(userId: number, newUserData: any) {
    return this.prisma.user.update({
      data: newUserData,
      where: {
        id: userId,
      },
    });
  }

  public async ChangePassword(email:string,password:string){
    return this.prisma.user.update({
      data: password,
      where: {email},
    })
  }
}
