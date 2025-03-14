---
sidebar_label: 'Introduction'
displayed_sidebar: webtoolsSidebar
slug: /addons
---

# Webtools addons

Webtools is all about tools to enhance your website management workflow in Strapi. At it's core, it will keep a register of all the URLs on your website, using those to uniquely identify the different pages. This is a functionality that can easily be built upon by other plugins who also expect Strapi to have a register of URLs. Think of a sitemap, a menu, dynamic links, redirects etc.

To enhance Webtools in a modular way, the core plugin allows addons to be registered to build upon it's functionalities. Addons are in Strapi terms just standalone plugins, but have `strapi-plugin-webtools` as a peer dependency. You will have to install each addon as you would normally install a plugin in to Strapi.

<CustomDocCardsWrapper>
<CustomDocCard emoji="🔀" title="Sitemap" description="The Sitemap addon can be used to generate a customizable sitemap using all your Webtools URL aliases" link="/webtools/addons/sitemap" />
</CustomDocCardsWrapper>
