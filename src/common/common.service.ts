import { Injectable } from '@nestjs/common';
import { omit, pick } from 'lodash';
import { User } from 'src/module/user/entities/user.entity';
@Injectable()
export class CommonService {
  generateOTP(): number {
    // Declare a digits variable
    // which stores all digits
    let digits = '0123456789';
    let OTP = '';
    let len = digits.length;
    for (let i = 0; i < 6; i++) {
      OTP += digits[Math.floor(Math.random() * len)];
    }
    return Number(OTP);
  }

  getUserOmitPassword(user: User) {
    // Loại bỏ password khỏi response
    return omit(user, ['password']);
  }
  getEssentialUserData(user: User) {
    // Chỉ lấy thông tin cần thiết
    return pick(user, ['id', 'email','role']);
  }
  getEssentialByCondition(user:User,condition:string[]){
    return pick(user, condition);
  }
}
