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

## Multiple URL Changes

When you change the same URL multiple times, the addon intelligently manages redirects to prevent chains:

**Scenario 1: First URL change**
```
Original URL:  /my-article
New URL:       /my-article-updated

Result: Creates redirect /my-article → /my-article-updated ✓
```

**Scenario 2: Second URL change (updates existing redirect)**
```
Current URL:   /my-article-updated
New URL:       /my-article-final

Result:
- Updates existing redirect to: /my-article → /my-article-final ✓
- Creates new redirect: /my-article-updated → /my-article-final ✓
```

This strategy prevents redirect chains and ensures all old URLs point directly to the current URL. Both `/my-article` and `/my-article-updated` will redirect straight to `/my-article-final` without intermediate hops.

:::tip Smart Redirect Management
The addon automatically updates existing redirects that point to the old URL, ensuring no chains are created. This means you can freely change URLs multiple times without worrying about redirect performance.
:::

## Chain Prevention

Auto-generate includes built-in protection against [redirect chains and loops](/addons/redirects/usage#redirect-chains-and-loops). If a URL change would create a chain or loop, the system will:

1. **Log an error** in your server console
2. **Skip creating the redirect** automatically
3. **Allow you to manually resolve** the conflict

Check your server logs if you suspect redirects aren't being created as expected.

## Difference from sitemap cron

Unlike the sitemap addon which uses a cron job to periodically regenerate files, redirects are created **instantly** when you change a URL. There's no delay and no need for scheduled tasks - redirects are event-driven and created the moment you save your changes.

###### Key: `auto_generate `

> `required:` NO | `type:` bool | `default:` true
