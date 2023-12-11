import { Context, Request } from 'koa';

interface KoaRequest<RequestBody = any> extends Request {
  body?: RequestBody;
}

export interface KoaContext<RequestBody = any, ResponseBody = any> extends Context {
  request: KoaRequest<RequestBody>;
  body: ResponseBody;
}

export interface KoaResponseContext<ResponseBody> extends KoaContext<any, ResponseBody> {}
