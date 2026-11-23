---
layout: pages/home.pug
lang: de
slug: home
title: Laravel, KI und die Bugs dazwischen.
lead: 'Notizen aus der Praxis: LLM-Funktionen mit PHP ausliefern, mit Queues, Streaming, Evals und den Vorfällen, aus denen ich sie gelernt habe. Jeden zweiten Donnerstag ein neuer Beitrag.'
description: Notizen über LLM-Funktionen mit PHP.
archive_href: /de/archiv.html
---

```bash:terminal
composer require laravel/reverb
php artisan install:broadcasting
php artisan reverb:start
php artisan queue:work --tries=3
```
