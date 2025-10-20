---
sidebar_label: 'Auto generate'
displayed_sidebar: webtoolsRedirectsSidebar
slug: /addons/redirects/configuration/auto-generate
---

# Auto generate

## Overview

The auto-generate feature automatically creates redirects whenever you change the URL alias of a content entry in your Strapi application. This ensures visitors following old links will be seamlessly redirected to the new URL without encountering broken links or 404 errors.

## How it works

When enabled (which it is by default), the addon monitors URL alias changes and creates redirect entries automatically:

1. You change a page's URL from `/old-blog-post` to `/new-blog-post`
2. The addon detects this change
3. A redirect is automatically created: `/old-blog-post` → `/new-blog-post`
4. Visitors using the old URL are redirected to the new location

## Why use this?

**Preserves SEO rankings**: Search engines have indexed your old URLs. Redirects ensure you don't lose search engine rankings when changing URLs.

**Prevents broken links**: External sites, bookmarks, and shared links pointing to your old URLs continue to work.

**Improves user experience**: Visitors are automatically sent to the correct page instead of seeing a 404 error.

**Saves time**: No need to manually track and create redirects for every URL change.

## Example scenario

Imagine you have a blog post at `/blog/how-to-use-strapi` that's been shared widely and indexed by Google. Later, you decide to rename it to `/blog/complete-strapi-guide`.

**With auto-generate enabled:**
- You update the URL alias in Strapi
- A redirect is automatically created
- Old links continue to work
- Your SEO rankings are preserved

**With auto-generate disabled:**
- You update the URL alias in Strapi
- Old links lead to 404 errors
- You lose traffic from external links
- You have to manually create redirects

## When to disable

You might want to disable auto-generate if:
- You want full manual control over all redirects
- You're doing bulk URL changes and want to review redirects afterwards
- You're migrating content and have a custom redirect strategy

:::tip
Keep this enabled for production sites. It's a safety net that prevents broken links automatically.
:::

## Difference from sitemap cron

Unlike the sitemap addon which uses a cron job to periodically regenerate files, redirects are created **instantly** when you change a URL. There's no delay and no need for scheduled tasks - redirects are event-driven and created the moment you save your changes.

###### Key: `auto_generate `

> `required:` NO | `type:` bool | `default:` true
