---
layout: pages/post.pug
lang: de
slug: streaming-reverb
title: 'LLM-Antworten mit Laravel Reverb streamen'
description: 'Mit Polling fühlte sich unser Chat an wie ein Faxgerät. Hier ist der WebSocket-Aufbau, der das erste Token nach 300 ms zeigt, und die zwei Fehler, die mich ein Wochenende gekostet haben.'
lead: 'Mit Polling fühlte sich unser Chat an wie ein Faxgerät. Hier ist der WebSocket-Aufbau, der das erste Token nach 300 ms zeigt, und die zwei Fehler, die mich ein Wochenende gekostet haben.'
date: 2026-11-19
updated: 2026-11-21
tags: ['AI & LLMs', Reverb, Queues, WebSockets]
series: 'Chat, der sich sofort anfühlt'
series_part: 2
facts:
    - label: Laravel
      value: '12.4'
    - label: Reverb
      value: '1.5'
    - label: PHP
      value: '8.4'
---

Unser Support-Chat antwortete nach acht Sekunden. Sechs davon brauchte das Modell, und sechs Sekunden lang sah die Kundin drei hüpfende Punkte. Über die Antworten hat sich niemand beschwert. Über das Warten alle.

Die Lösung war kein schnelleres Modell, sondern die Antwort zu zeigen, während sie entsteht. Mit [Laravel Reverb](https://reverb.laravel.com) braucht das ein Event, einen Job in der Queue und rund vierzig Zeilen Code.

## Das Broadcast-Event

Jedes Stück, das das Modell liefert, wird ein kleines Event auf einem privaten Kanal. Halten Sie die Nutzlast klein: Chat-ID, Text und eine laufende Nummer, über die Sie später froh sind.

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

> **ShouldBroadcastNow verwenden** Die Variante mit Queue stellt jedes Token hinter Ihre anderen Jobs. Die Tokens kommen dann in Schüben an, und das wirkt schlechter als gar kein Streaming.

## Streamen aus dem Job

Der Job fragt das Modell nach einem Stream und reicht jedes Stück weiter. Gegenüber der blockierenden Fassung ändern sich zwei Zeilen:

```diff:app/Jobs/AnswerChat.php
- $answer = $llm->chat($messages);
- $chat->reply($answer->text);
+ foreach ($llm->stream($messages) as $i => $chunk) {
+     broadcast(new TokenReceived($chat->id, $chunk->text, $i));
+     $buffer .= $chunk->text;
+ }
+ $chat->reply($buffer);
```

Drei Dinge prüfen Sie vor dem Ausliefern:

- Das Timeout des Jobs ist länger als Ihre langsamste Antwort, sonst beendet der Worker ihn mitten im Satz.
- Der fertige Text landet trotzdem in der Datenbank, damit ein Neuladen die ganze Antwort zeigt.
- Der Kanal ist privat. Die Antworten anderer sind kein öffentlicher Broadcast.

## Was es gebracht hat

Die Gesamtzeit blieb gleich. Geändert hat sich, wann die Kundin etwas sieht:

| Aufbau | Erstes Token | Ganze Antwort | Abgebrochene Chats |
| --- | --- | --- | --- |
| Blockierender Request | 6,1 s | 6,1 s | 17 % |
| Polling jede Sekunde | 1,9 s | 6,8 s | 11 % |
| Reverb-Stream | 0,3 s | 6,2 s | 4 % |
