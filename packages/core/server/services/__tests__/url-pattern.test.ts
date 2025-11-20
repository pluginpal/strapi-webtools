// Mock @strapi/strapi
jest.mock('@strapi/strapi', () => ({
    factories: {
        createCoreService: (uid: string, serviceFactory: any) => serviceFactory,
    },
}));

import urlPatternService from '../url-pattern';

// Mock the global strapi object
global.strapi = {
    contentTypes: {
        'api::article.article': {
            info: {
                pluralName: 'articles',
            },
            attributes: {
                title: {
                    type: 'string',
                },
                categories: {
                    type: 'relation',
                    relation: 'manyToMany',
                    target: 'api::category.category',
                },
            },
        },
        'api::category.category': {
            attributes: {
                name: {
                    type: 'string',
                },
            },
        },
    },
    config: {
        get: (path: string) => {
            if (path === 'plugin::webtools') {
                return {
                    slugify: (str: string) => str.toLowerCase().replace(/\s+/g, '-'),
                };
            }
            return {};
        },
    },
    log: {
        error: jest.fn(),
    },
} as any;

// Mock getPluginService
jest.mock('../../util/getPluginService', () => ({
    getPluginService: (name: string) => {
        if (name === 'url-pattern') {
            return urlPatternService({ strapi: global.strapi });
        }
        return {};
    },
}));

describe('url-pattern service', () => {
    const service = urlPatternService({ strapi: global.strapi });

    describe('getAllowedFields', () => {
        it('should include fields from many-to-many relations with index', () => {
            const contentType = global.strapi.contentTypes['api::article.article'];
            const allowedFields = ['string'];

            const fields = service.getAllowedFields(contentType, allowedFields);

            expect(fields).toContain('categories[0].name');
        });
    });

    describe('resolvePattern', () => {
        it('should resolve pattern with many-to-many relation using index', () => {
            const uid = 'api::article.article';
            const entity = {
                title: 'My Article',
                categories: [
                    { name: 'Tech' },
                    { name: 'News' },
                ],
            };
            const pattern = '/[categories[0].name]/[title]';

            const resolvedPath = service.resolvePattern(uid as any, entity, pattern);

            expect(resolvedPath).toBe('/tech/my-article');
        });

        it('should resolve pattern with many-to-many relation using specific index', () => {
            const uid = 'api::article.article';
            const entity = {
                title: 'My Article',
                categories: [
                    { name: 'Tech' },
                    { name: 'News' },
                ],
            };
            const pattern = '/[categories[1].name]/[title]';

            const resolvedPath = service.resolvePattern(uid as any, entity, pattern);

            expect(resolvedPath).toBe('/news/my-article');
        });

        it('should handle empty many-to-many relation', () => {
            const uid = 'api::article.article';
            const entity = {
                title: 'My Article',
                categories: [],
            };
            const pattern = '/[categories[0].name]/[title]';

            const resolvedPath = service.resolvePattern(uid as any, entity, pattern);

            expect(resolvedPath).toBe('/my-article');
        });
    });
});
