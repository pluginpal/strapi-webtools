export default async (ctx, next) => {
  if (! ctx.query.populate) {
    ctx.query.populate = ['createdBy', 'updatedBy'];
  }

  await next();
}
