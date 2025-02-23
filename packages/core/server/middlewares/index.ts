import cloneMiddleware from './clone';
import deleteMiddleware from './delete';
import creatMiddleware from './create';
import updateMiddleware from './update';

export default {
  clone: cloneMiddleware,
  delete: deleteMiddleware,
  create: creatMiddleware,
  update: updateMiddleware,
};
