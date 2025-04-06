import { setupStrapi, stopStrapi } from '../../../../../../playground/tests/helpers';

beforeAll(async () => {
  await setupStrapi();
});

afterAll(async () => {
  await stopStrapi();
});

describe('Validation middleware', () => {
  it('Should throw if "from" is missing', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          to: '/new-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'The "from" field is required.',
    });
  });

  it('Should throw if "to" is missing', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/old-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'The "to" field is required.',
    });
  });

  it('Should throw if "status_code" is missing', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/old-url',
          to: '/new-url',
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'The "status_code" field is required.',
    });
  });

  it('Should throw if "from" and "to" are the same', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/old-url',
          to: '/old-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'The "from" and "to" fields cannot be the same.',
    });
  });

  it('Should throw if "from" is an external URL', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: 'https://example.com/old-url',
          to: '/new-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'The "from" field must not be an external URL.',
    });
  });

  it('Should throw if "from" does not start with a leading slash', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: 'old-url',
          to: '/new-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'The "from" field must start with a leading slash.',
    });
  });

  it('Should throw if "to" does not start with a leading slash', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/old-url',
          to: 'new-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'Internal redirects must start with a leading slash.',
    });
  });

  it('Should not throw if "to" is an external URL', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/external-old-url',
          to: 'https://example.com/new-url',
          status_code: 307,
        },
      }),
    ).resolves.not.toThrow();
  });

  it('Should throw for an invalid redirect status_code', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/old-url',
          to: '/new-url',
          status_code: 200,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'The "status_code" must be between 300 and 308.',
    });
  });

  it('Should throw if there is already a redirect originating from this "from"', async () => {
    await strapi.documents('plugin::webtools-addon-redirects.redirect').create({
      data: {
        from: '/old-url',
        to: '/new-url',
        status_code: 307,
      },
    });

    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/old-url',
          to: '/another-new-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'A redirect with the same "from" value already exists.',
    });
  });

  it('Should throw when the redirect would create a loop', async () => {
    await strapi.documents('plugin::webtools-addon-redirects.redirect').create({
      data: {
        from: '/another-old-url',
        to: '/new-url',
        status_code: 307,
      },
    });

    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/new-url',
          to: '/another-old-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'Creating this redirect would create a loop, please change it.',
    });
  });

  it('Should throw when the redirect would create a chain', async () => {
    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').create({
        data: {
          from: '/some-other-old-url',
          to: '/another-old-url',
          status_code: 307,
        },
      }),
    ).rejects.toMatchObject({
      name: 'ValidationError',
      message: 'Creating this redirect would create a chain, please change it.',
    });
  });

  it('Should not throw for required fields when updating the redirect', async () => {
    const redirect = await strapi.documents('plugin::webtools-addon-redirects.redirect').create({
      data: {
        from: '/yet-another-old-url',
        to: '/new-url',
        status_code: 307,
      },
    });

    await expect(
      strapi.documents('plugin::webtools-addon-redirects.redirect').update({
        documentId: redirect.documentId,
        data: {
          status_code: 301,
        },
      }),
    ).resolves.not.toThrow();
  });
});
