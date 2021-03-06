Display a sequence of sentences
================================================================================

Example
--------------------------------------------------------------------------------

```yaml
- message: I am a cat. I don't have my name yet.
- message: I don't know where I was born.
- message: I only remember that I was meowing in dim and wet place.
- message: I saw something called human beings for the first time there.
```

or simply,

```yaml
- I am a cat. I don't have my name yet.
- I don't know where I was born.
- I only remember that I was meowing in dim and wet place.
- I saw something called human beings for the first time there.
```

Multiple-line sentences are following:

```yaml
- |-
  I am a cat.
  I don't have my name yet.
```

Each letters of the sentence will be displayed in order.
When the next button is clicked, all letters will be displayed immediately.
If `next: wait` is specified, the next button won't work.

```yaml
- message: I am a cat. I don't have my name yet.
  next: wait
- message: I don't know where I was born.
  next: wait
- message: I only remember that I was meowing in dim and wet place.
  next: wait
- message: I saw something called human beings for the first time there.
  next: wait
```

If `auto: {milliseconds}` is specified,
the next message will be displayed automatically after {milliseconds}
without clicking the next button.

```yaml
- message: I am a cat. I don't have my name yet.
  auto: 1000
- message: I don't know where I was born.
  auto: 0
- message: I only remember that I was meowing in dim and wet place.
  auto: 1000
  next: wait
- message: I saw something called human beings for the first time there.
```

To embed a hyperlink, write `${[label](url or absolute path or relative path)}`.

```yaml
- I am a ${[cat](http://example.com)}. I don't have my name yet.
```

In the example below, the ruby will be displayed on the word.

```yaml
- ${word(ruby)}
```
