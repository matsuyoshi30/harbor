# [harbor](https://themes.gohugo.io/harbor/) - Simple Hugo Theme

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=matsuyoshi30_harbor&metric=alert_status)](https://sonarcloud.io/dashboard?id=matsuyoshi30_harbor)
[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmatsuyoshi30%2Fharbor.svg?type=shield)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmatsuyoshi30%2Fharbor?ref=badge_shield)

Simple and minimal personal blog theme for [Hugo](https://gohugo.io/).

![screenshot](https://user-images.githubusercontent.com/16238709/77252732-3698c880-6c99-11ea-9def-15a5f9b918bc.png)

![screenshot-dark](https://user-images.githubusercontent.com/16238709/77252745-529c6a00-6c99-11ea-95f6-2df83dfff35e.png)

[DEMO](https://matsuyoshi30.net/harbor/) is built from [exampleSite](https://github.com/matsuyoshi30/harbor/tree/exampleSite).

## Features

- Support tags, categories and archives
- Analytics integration (Google, Goatcounter or Matomo)
- Responsive
- Dark mode
- Syntax Highlight (see [Hugo doc](https://gohugo.io/content-management/syntax-highlighting/))
- Search entire blog posts
- Table Of Contents
- Disqus
- Most social media

## Installation & Update

```
$ # install
$ cd themes
$ git submodule add https://github.com/matsuyoshi30/harbor.git harbor

$ # update
$ git submodule update --remote --merge
```

If you want to know more information, see [Hugo doc](https://gohugo.io/themes/installing/).

## Usage

### `config.toml` example

```toml
theme = "harbor"
baseurl = "https://example.com/"
title = "Hugo Themes"
paginate = 3
languageCode = "en"
DefaultContentLanguage = "en"
enableInlineShortcodes = true
footnoteReturnLinkContents = "^"

# Optional
# If you use googleAnalytics, you set top-level options in config.toml to the beginning of the config file like other top-level options.
googleAnalytics = "UA-XXXXXXXX-XX"
# and disqus too.
disqusShortName = "yourdisqusshortname"

[params.goatcounter]
  domain="stats.domain.com"

[params.matomo]
  domain="stats.domain.com"
  id="123"

[Author]
  name = "Hugo Author"

[outputs]
  section = ["JSON", "HTML"]

[[params.nav]]
  identifier = "about"
  name = "About"
  icon = "fas fa-user fa-lg"
  url = "/about/"
  weight = 3

[[params.nav]]
  identifier = "tags"
  name = "Tags"
  icon = "fas fa-tag fa-lg"
  url = "tags"
  weight = 3

[[params.nav]]
  identifier = "categories"
  name = "Category"
  icon = "fas fa-folder-open fa-lg"
  url = "categories"
  weight = 3

[[params.nav]]
  identifier = "search"
  name = "Search"
  icon = "fas fa-search fa-lg"
  url = "search"
  weight = 3

[[params.nav]]
  identifier = "archives"
  name = "Archives"
  icon = "fas fa-archive fa-lg"
  url = "archives"
  weight = 3

# copy paste this block and change for each social media to add how many ever social media
# acounts/links you want
[[params.social]]
  name="name of social media"
  url="link to social media"
  icon="A icon from https://fontawesome.com/"

[params.logo]
  url = "icon.png" # static/images/icon.png
  width = 50
  height = 50
  alt = "Logo"
```

Before you user my theme, don't remember to change favicon (static/favicon.ico) and icon (static/images/icon.png)!

If you don't change them, your favicon and icon are my face :)

### Search entire blog posts

You should make `search.md` in the `content` directory.

```
---
title: "Search"
layout: "search"
---
```

### TOC

If you want to use TableOfContent, you need to write words greater than 400, and set `true` of the frontmatter `toc`.

### Back To Top Button

If you want to use Back To Top Button, you need to write words greater than 400, and set `true` of the frontmatter `backtotop`.

### Archives

If you want archive page, generate `archives.md` file in the `content` directory.

```
$ hugo new archives.md
```

```
---
title: "Archive page"
type: archives
---
```

### Override CSS

If you want to override CSS, add `customCSS` param which is path to CSS file to your config.toml.

```
[params]
  customCSS = ["/css/custom.css"] # in case you use `/static/css/custom.css`
```

### Enable Google Analytics when running as server

If you want to enable google analytics when running hugo as server, add `enableGoogleAnalytics` param to your config.toml.

```
[params]
  enableGoogleAnalytics = true
```

### Enable UglyURLs

If you want to enable "Ugly URLs" (e.g. exmaple.com/urls.html), add `uglyurls = true` to top level and [params] of your config.toml.

```
uglyurls = true

[params]
  uglyurls = true
```

### Enable Bottom Navigation

If you want to enable bottom navigation in , add `enableBottomNavigation = true` params to your config.toml.

```
[params]
  enableBottomNavigation = true
```

## Frontmatter example

```
+++
title = "Article title here"
date = 2020-02-15T20:00:00+09:00
tags = ["tags here"]
draft = false
toc = false
backtotop = false
disable_comments = true <!-- disable disqus -->
+++

# Title

<!-- when toc is true and post wordcounts is greater than 400 -->

## Contents

```

## Contribution

**Issues and PRs are very welcome!**

### Development

If you touch CSS or JavaScript file, you need to build to add your changes following below steps.

1. Install Node.js and npm (Node.js package manager).

2. The package.json file in your new sub-theme contains the versions of all the Node.js software you need.
  To install them run:

    ```
    $ npm install
    ```

3. After fixing files, you can format like below. (Auto format before commit using husky)

    ```
    $ npm run format
    ```

## LICENSE

[MIT](./LICENSE).

[![FOSSA Status](https://app.fossa.com/api/projects/git%2Bgithub.com%2Fmatsuyoshi30%2Fharbor.svg?type=large)](https://app.fossa.com/projects/git%2Bgithub.com%2Fmatsuyoshi30%2Fharbor?ref=badge_large)

## Author

[matsuyoshi30](https://twitter.com/matsuyoshi30)
