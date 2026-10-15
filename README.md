# CS224N Study App

Short, card-based lessons for Stanford's **CS224N: Natural Language Processing with Deep Learning**, built to be studied on a phone without watching the lecture videos. Every lesson is written in **Arabic and English side by side**, and you can switch language at any time.

**Live app:** https://s7s.github.io/cs224n_study_app/

> Unofficial study companion. Not affiliated with or endorsed by Stanford.

## What's inside

| | |
|---|---|
| Lectures | 18 (L1 to L18) |
| Cards | 234 |
| Quiz questions | 469 |
| Flashcards | 474 |
| Glossary terms | 553 |

Each lecture is a sequence of short cards. A card follows the same pattern: intuition first, then the definition or equation, then a small worked numeric example, and a common mistake where one applies. About every second card has an inline SVG figure. The last card of every lecture is a **Recap** (5 key points, the main equations, and what to know before the next lecture).

## Features

- **Bilingual and RTL-aware.** Arabic (right-to-left) and English, switchable per session.
- **Questions on every card**, one conceptual and one applied or computational where it makes sense.
- **Spaced-repetition review.** Flashcards move through boxes and come due on a schedule. The Review tab shows how many are due.
- **Mistakes and Mixed quiz.** Wrong answers are collected so you can retry them, and a mixed quiz pulls questions from every lecture you have finished.
- **Glossary** built automatically from the terms defined in the cards.
- **Search** across cards and terms.
- **Day streak** counter.
- **Backup and restore** of your progress as copyable text.
- **Mobile-first.** Works as a home-screen app on iOS and Android, with light and dark theme colors.

## Using it on your phone

1. Open the live link in Safari (iPhone) or Chrome (Android).
2. iPhone: Share, then **Add to Home Screen**. Android: browser menu, then **Install app** or **Add to Home screen**.

Your progress is stored in your browser's `localStorage` (key `cs224n_v1`), so it is tied to one browser and one URL. Use **Back up progress** on the home screen before switching devices, browsers, or links, and paste the text into the restore box on the other side. The IBM Plex fonts load from Google Fonts, so the first load needs an internet connection.

## Run locally

It is a plain static site with no build step.

```bash
git clone https://github.com/s7s/cs224n_study_app.git
cd cs224n_study_app
python3 -m http.server 8000
# open http://localhost:8000
```

Opening `index.html` directly from disk also works in a desktop browser, but `localStorage` behavior on `file://` varies, so a local server is more reliable.

## Project structure

```
index.html          App shell; loads helpers, all lectures, then app.js
assets/
  app.js            UI, progress, spaced repetition, quiz, search, backup
  helpers.js        Authoring helpers for lecture files
  style.css         Styles (light and dark)
lectures/
  lecture-01.js     One data file per lecture, L1 to L18
  ...
```

## Editing content

Each lecture is one file in `lectures/` that pushes a single object onto `window.LECS`, using the helpers from `assets/helpers.js` (for example `B(ar, en)` for bilingual text). Test any change locally before pushing. Two things must not change, or existing users lose their progress:

- the `cs224n_v1` storage key in `assets/app.js`
- the L1 to L18 lecture numbering and the existing card ids

## Deployment

The site is deployed with GitHub Pages straight from the `main` branch root (Settings, Pages, Deploy from a branch, `main`, `/ (root)`). Every push to `main` updates the live app within a minute or two.