import { Context, Next } from 'koa';

export default async (ctx: Context, next: Next) => {
  if (!ctx.query.populate) {
    ctx.query.populate = ['createdBy', 'updatedBy'];
  }

  await next();
};
