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

export interface IDecoratedService {
  create: {
    call: (context: any, uid: any, options: any) => Promise<{
      id: number,
      locale?: string,
      localizations?: [
        {
          url_alias: {
            id: number
          },
        },
      ],
    }>
  },
  update: {
    call: (context: any, uid: any, id: any, options: any) => Promise<{
      id: number
      locale?: string,
      localizations?: [
        {
          url_alias: {
            id: number
          },
        },
      ],
    }>
  },
  delete: {
    call: (context: any, uid: any, options: any) => Promise<{ id: number }>
  }
  findOne: {
    call: (context: any, uid: any, id: any, options: any) => Promise<{
      id: number, url_alias?: Attribute.GetValues<'plugin::webtools.url-alias', Attribute.GetNonPopulatableKeys<'plugin::webtools.url-alias'>>
    }>
  }
}

export interface IDecoratedServiceOptions<Fields> {
  data: Fields
  populate: {
    localizations: {
      populate: {
        url_alias: {
          fields: ['id']
        }
      }
    }
  }
}
