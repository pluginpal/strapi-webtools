---
"webtools-addon-sitemap": patch
---

fix(sitemap): trigger autoGenerate on publish and unpublish actions

In Strapi 5, publish and unpublish are separate document service actions and do not go through the update action. Adds both to the autoGenerateMiddleware allowlist so the sitemap regenerates immediately on publish/unpublish.
