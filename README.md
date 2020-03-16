# [harbor](https://themes.gohugo.io/harbor/) - Simple Hugo Theme

Simple and minimal personal blog theme for [Hugo](https://gohugo.io/).

## Features

- Support tags
- Google Analytics integration
- Responsive
- Dark mode
- Syntax Highlight (see [Hugo doc](https://gohugo.io/content-management/syntax-highlighting/))
- Search entire blog posts
- Table Of Contents

## Installation & Update

```
$ # install
$ mkdir themes
$ cd themes
$ git submodule add https://github.com/matsuyoshi30/harbor.git harbor

$ # update
$ git submodule update --remote --merge
```

If you want to know more information, see [Hugo doc](https://gohugo.io/themes/installing/).

## Usage

When you manually create files by following [quick start (step4)](https://gohugo.io/getting-started/quick-start/#step-4-add-some-content), you should command `hugo new post/<filename>.md` instead of `hugo new posts/<filename>.md` because some styles are specified by the class name (like `post-heading`) in the [main.css](./static/css/main.css).

### `config.toml` example

```
themes = "harbor"
baseurl = "https://example.com/"
title = "Hugo Themes"
paginate = 3
languageCode = "en"
DefaultContentLanguage = "en"
enableInlineShortcodes = true
footnoteReturnLinkContents = "^"

googleAnalytics = "UA-XXXXXXXX-XX" # Optional

[Author]
  name = "Hugo Author"

[outputs]
  section = ["JSON", "HTML"]

[[params.nav]]
  identifier = "about"
  name = "About"
  icon = "fas fa-userfa-lg"
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

[params.logo]
  url = "icon.png"
  width = 50
  height = 50
  alt = "Logo"
```

### Search entire blog posts

You should make ```search.md``` in content directory.

```
---
title: "Search"
---

{{<search>}}
```

### TOC

If you want to use TableOfContent, you need to write words greater than 400, and set `true` frontmatter `toc`.

### Back To Top Button

If you want to use Back To Top Button, you need to write words greater than 400, and set `true` frontmatter `backtotop`.

## Frontmatter example

```
+++
title = "Article title here"
date = 2020-02-15T20:00:00+09:00
tags = ["tags here"]
draft = false
toc = false
backtotop = false
+++

# Title

<!-- when toc is true and post wordcounts is greater than 400 -->

## Contents
```

## LICENSE

[MIT](./LICENSE).
