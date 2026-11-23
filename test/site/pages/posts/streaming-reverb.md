---
layout: pages/post.pug
lang: en
slug: streaming-reverb
title: 'Streaming LLM responses with Laravel Reverb'
description: 'Polling made our chat feel like a fax machine. Here is the WebSocket setup that puts the first token on screen in 300 ms, and the two mistakes that cost me a weekend.'
lead: 'Polling made our chat feel like a fax machine. Here is the WebSocket setup that puts the first token on screen in 300 ms, and the two mistakes that cost me a weekend.'
date: 2026-11-19
updated: 2026-11-21
tags: ['AI & LLMs', Reverb, Queues, WebSockets]
series: 'Chat that feels instant'
series_part: 2
facts:
    - label: Laravel
      value: '12.4'
    - label: Reverb
      value: '1.5'
    - label: PHP
      value: '8.4'
---

Our support chat answered in eight seconds. The model needed six of them, and for all six the customer stared at three bouncing dots. Nobody complained about the answers. Everybody complained about the wait.

The fix was not a faster model. It was showing the answer while it is being written. With [Laravel Reverb](https://reverb.laravel.com) that takes one event, one queued job and about forty lines of code.

## The broadcast event

Each chunk the model returns becomes one small event on a private channel. Keep the payload tiny: the chat id, the text, and a sequence number you will be glad to have later.

```php:app/Events/TokenReceived.php
final class TokenReceived implements ShouldBroadcastNow
{
    public function __construct(
        public int $chatId,
        public string $text,
        public int $seq,
    ) {}

    public function broadcastOn(): PrivateChannel
    {
        return new PrivateChannel("chat.{$this->chatId}");
    }
}
```

> **Use ShouldBroadcastNow** The queued variant puts every token behind your other jobs. Tokens then arrive in bursts, which looks worse than not streaming at all.

## Streaming from the job

The job asks the model for a stream and forwards each chunk. Two lines changed compared to the blocking version:

```diff:app/Jobs/AnswerChat.php
- $answer = $llm->chat($messages);
- $chat->reply($answer->text);
+ foreach ($llm->stream($messages) as $i => $chunk) {
+     broadcast(new TokenReceived($chat->id, $chunk->text, $i));
+     $buffer .= $chunk->text;
+ }
+ $chat->reply($buffer);
```

Three things to check before you ship it:

- The job timeout is longer than your slowest answer, or the worker kills it mid-sentence.
- The final text is still written to the database, so a page reload shows the whole reply.
- The channel is private. Other people's answers are not a public broadcast.

## What it bought us

Total time did not change. What changed is when the customer sees something happen:

| Setup | First token | Full answer | Abandoned chats |
| --- | --- | --- | --- |
| Blocking request | 6.1 s | 6.1 s | 17% |
| Polling every second | 1.9 s | 6.8 s | 11% |
| Reverb stream | 0.3 s | 6.2 s | 4% |
