import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  BadGatewayException,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  map,
  Observable,
  throwError,
  catchError,
  tap,
  timeout,
  TimeoutError,
} from 'rxjs';

export interface Response<T> {
  data: T;
}

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    console.log('Before reaching the handler');

    const now = Date.now();
    return next
      .handle()
      .pipe(tap(() => console.log(`Response Lag...${Date.now() - now}ms`)));
  }
}

@Injectable()
export class AuditLogInterceptor<T> implements NestInterceptor<T, Response<T>> {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<Response<T>> {
    return next.handle().pipe(
      map((data) => ({
        data,
        salary: 3000,
        statusLogin: true,
        errMessage: 1,
      })),
    );
  }
}

@Injectable()
export class ExceptionInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next
      .handle()
      .pipe(catchError((err) => throwError(() => new BadGatewayException())));
  }
}

@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      timeout(1000),
      catchError((err) => {
        if (err instanceof TimeoutError) {
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => new Error());
      }),
    );
  }
}
