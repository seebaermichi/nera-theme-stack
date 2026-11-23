---
layout: pages/home.pug
lang: en
slug: home
title: Laravel, AI, and the bugs in between.
lead: 'Field notes on shipping LLM features with PHP: queues, streaming, evals, and the incidents that taught me each of them. A new post every other Thursday.'
description: Field notes on shipping LLM features with PHP.
archive_href: /archive.html
---

```bash:terminal
composer require laravel/reverb
php artisan install:broadcasting
php artisan reverb:start
php artisan queue:work --tries=3
```
