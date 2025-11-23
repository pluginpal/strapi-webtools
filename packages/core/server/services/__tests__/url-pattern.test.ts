import urlPatternService from '../url-pattern';

// Mock getPluginService to return the service itself
jest.mock('../../util/getPluginService', () => ({
  getPluginService: () => urlPatternService,
}));

jest.mock('@strapi/strapi', () => ({
  factories: {
    createCoreService: (uid, cfg) => {
      if (typeof cfg === 'function') return cfg();
      return cfg;
    },
  },
}));

// Mock Strapi global
global.strapi = {
  config: {
    get: jest.fn((key) => {
      if (key === 'plugin::webtools') return { slugify: (str) => str.toLowerCase().replace(/\s+/g, '-') };
      if (key === 'plugin::webtools.default_pattern') return '/[id]';
      return null;
    }),
  },
  contentTypes: {
    'api::article.article': {
      attributes: {
        title: { type: 'string' },
        categories: {
          type: 'relation',
          relation: 'manyToMany',
          target: 'api::category.category',
        },
        author: {
          type: 'relation',
          relation: 'oneToOne',
          target: 'api::author.author',
        }
      },
      info: { pluralName: 'articles' },
    },
    'api::category.category': {
      attributes: {
        slug: { type: 'string' },
        name: { type: 'string' },
      },
    },
    'api::author.author': {
      attributes: {
        name: { type: 'string' },
      }
    }
  },
  log: {
    error: jest.fn(),
  },
} as any;


describe('URL Pattern Service', () => {
  const service = urlPatternService as any;

  describe('getAllowedFields', () => {
    it('should return allowed fields including ToMany relations', () => {
      const contentType = strapi.contentTypes['api::article.article'];
      const allowedFields = ['string', 'uid'];
      const fields = service.getAllowedFields(contentType, allowedFields);

      expect(fields).toContain('title');
      expect(fields).toContain('author.name');
      // This is the new feature we want to support
      expect(fields).toContain('categories.slug');
    });

    it('should return allowed fields for underscored relation name', () => {
      const contentType = {
        attributes: {
          private_categories: {
            type: 'relation',
            relation: 'manyToMany',
            target: 'api::category.category',
          },
        },
      } as any;

      // Mock strapi.contentTypes for the target
      strapi.contentTypes['api::category.category'] = {
        attributes: {
          slug: { type: 'uid' },
        },
      } as any;

      const allowedFields = ['uid'];
      const fields = service.getAllowedFields(contentType, allowedFields);

      expect(fields).toContain('private_categories.slug');
    });
  });

  describe('resolvePattern', () => {
    it('should resolve pattern with ToMany relation array syntax', () => {
      const uid = 'api::article.article';
      const entity = {
        title: 'My Article',
        categories: [
          { slug: 'tech', name: 'Technology' },
          { slug: 'news', name: 'News' },
        ],
      };
      const pattern = '/articles/[categories[0].slug]/[title]';

      const resolved = service.resolvePattern(uid, entity, pattern);

      expect(resolved).toBe('/articles/tech/my-article');
    });

    it('should resolve pattern with dashed relation name', () => {
      const uid = 'api::article.article';
      const entity = {
        'private-categories': [
          { slug: 'tech' },
        ],
      };
      const pattern = '/articles/[private-categories[0].slug]';

      const resolved = service.resolvePattern(uid, entity, pattern);

      expect(resolved).toBe('/articles/tech');
    });

    it('should handle missing array index gracefully', () => {
      const uid = 'api::article.article';
      const entity = {
        title: 'My Article',
        categories: [],
      };
      const pattern = '/articles/[categories[0].slug]/[title]';

      const resolved = service.resolvePattern(uid, entity, pattern);

      // Should probably result in empty string for that part or handle it?
      // Current implementation replaces with empty string if missing.
      expect(resolved).toBe('/articles/my-article');
    });
  });

  describe('validatePattern', () => {
    it('should validate pattern with underscored relation name', () => {
      const pattern = '/test/[private_categories[0].slug]/1';
      const allowedFields = ['private_categories.slug'];

      const result = service.validatePattern(pattern, allowedFields);

      expect(result.valid).toBe(true);
    });

    it('should validate pattern with dashed relation name', () => {
      const pattern = '/test/[private-categories[0].slug]/1';
      const allowedFields = ['private-categories.slug'];

      const result = service.validatePattern(pattern, allowedFields);

      expect(result.valid).toBe(true);
    });
    it('should invalidate pattern with forbidden fields', () => {
      const pattern = '/articles/[forbidden]/[title]';
      const allowedFields = ['title'];

      const result = service.validatePattern(pattern, allowedFields);

      expect(result.valid).toBe(false);
    });
  });

  describe('getRelationsFromPattern', () => {
    it('should return relation name without array index', () => {
      const pattern = '/articles/[categories[0].slug]/[title]';
      const relations = service.getRelationsFromPattern(pattern);

      expect(relations).toContain('categories');
      expect(relations).not.toContain('categories[0]');
    });
  });
});
