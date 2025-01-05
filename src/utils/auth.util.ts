import * as bcrypt from 'bcrypt'
import { randomUUID } from 'crypto'

/**
 * Hàm để mã hóa mật khẩu
 * @param password Mật khẩu chưa mã hóa
 * @returns Promise<string> Mật khẩu đã mã hóa
 */

export const fnHashpassword  = async (password: string):Promise<string> => {
    const saltRound = 10
    return await bcrypt.hash(password, saltRound)
}
/**
 * Hàm để xác minh mật khẩu
 * @param password Mật khẩu chưa mã hóa
 * @param hashedPassword Mật khẩu đã mã hóa
 * @returns Promise<boolean> Kết quả so sánh
 */

export const fnVerifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    const isMatch = await bcrypt.compare(password, hashedPassword); 
    return isMatch;
};

/**
 * function generate code to verify account 
 * @param min: number = 1000
 * @param max: number = 9999
 * @returns number.toString -> Code in range (1000,9999) example 9999
 */
export function fnGenerateVerifyCode(min: number = 1000, max: number = 9999) {
    min = Math.ceil(min);
    max = Math.floor(max);

    const number = Math.floor(Math.random() * (max - min + 1)) + min;
    return number.toString()
}

/**
 * function to generate publicKey, privateKey
 * @returns { publicKey, privateKey }
 */
export function fnGenerateSecretKey(){
    const publicKey = (crypto.randomUUID()).toString()+fnGenerateVerifyCode()
    const privateKey = (crypto.randomUUID()).toString()+fnGenerateVerifyCode()
    return { publicKey, privateKey }
}
