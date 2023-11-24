import { Strapi } from '@strapi/strapi';

/**
 * An extension of the Strapi type to include unsupported types.
 */
export interface IStrapi extends Omit<Strapi, 'entityService' | 'admin'> {
  entityService: Strapi['entityService'] & {
    decorate: (decorator: any) => {},
  }
  admin: Strapi['admin'] & {
    services: {
      permission: {
        actionProvider: {
          registerMany: (actions: any) => {}
        }
      }
    }
  }
}

export interface IDecoratedService {
  create: {
    call: (context: any, uid: any, options: any) => Promise<{ id: number }>
  },
  update: {
    call: (context: any, uid: any, id: any, options: any) => Promise<{ id: number }>
  },
  delete: {
    call: (context: any, uid: any, options: any) => Promise<{ id: number }>
  }
}

export interface IDecoratedServiceOptions<Fields> {
  data: Fields
}
