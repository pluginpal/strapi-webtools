import { Attribute, Strapi } from '@strapi/strapi';

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
