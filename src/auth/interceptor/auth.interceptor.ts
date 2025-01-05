import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { catchError, map, Observable, of } from "rxjs";
import { AuthResponseDTO } from "../dto/AuthResponseDTO";
import { plainToInstance } from "class-transformer";
export interface Response<T> {
    data: T;
}
@Injectable()
export class AuthInterceptor implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler):Observable<any> {
        return next.handle().pipe(map(data => {
            return plainToInstance(AuthResponseDTO, data, {
                excludeExtraneousValues: true,
            })
        }));
    }
}