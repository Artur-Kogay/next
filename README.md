# client-web-v2

Каркас фронтенд-проекта: **Next.js 15 (App Router) + React 19 + TypeScript + FSD + Jotai + TanStack Query + next-intl + SCSS Modules**.

UI-kit и конкретные продуктовые страницы **не входят** в этот скоуп — здесь только инфраструктура.

---

## Стек

| Слой | Технология |
| --- | --- |
| Фреймворк | Next.js 15 (App Router, RSC) |
| Язык | TypeScript 5.6 (strict) |
| React | 19 |
| Архитектура | Feature-Sliced Design 2.1 |
| Client state | Jotai 2 |
| Server state | TanStack Query 5 |
| HTTP | ofetch |
| Валидация | Zod |
| Формы | React Hook Form + zod resolver |
| Стили | SCSS Modules (Dart Sass) |
| i18n | next-intl |
| Пакетный менеджер | Yarn 4 (Berry, `node-modules` linker) |
| Линтинг | ESLint 9 flat config + boundaries, Stylelint 16 |
| Форматер | Prettier 3 |
| Git hooks | Husky + lint-staged + commitlint |
| Тесты | Vitest + RTL, Playwright |

---

## Быстрый старт

```bash
# Активировать Yarn 4 (один раз)
corepack enable
corepack prepare yarn@stable --activate

# Установить зависимости
yarn install

# Создать .env.local на базе .env.example
cp .env.example .env.local

# Dev-сервер
yarn dev
# → http://localhost:3000
```

Требуется Node.js ≥ 20 (зафиксировано в `.nvmrc`).

---

## Скрипты

| Команда | Что делает |
| --- | --- |
| `yarn dev` | dev-сервер Next |
| `yarn build` | production-сборка |
| `yarn start` | запуск production-сборки |
| `yarn lint` | ESLint |
| `yarn lint:fix` | ESLint с автофиксами |
| `yarn lint:styles` | Stylelint |
| `yarn lint:styles:fix` | Stylelint с автофиксами |
| `yarn typecheck` | `tsc --noEmit` |
| `yarn format` | Prettier для всего репо |
| `yarn test` | Vitest |
| `yarn test:watch` | Vitest в watch |
| `yarn test:coverage` | покрытие Vitest |
| `yarn e2e` | Playwright |
| `yarn e2e:ui` | Playwright в UI-режиме |
| `yarn analyze` | bundle analyzer (`ANALYZE=true next build`) |

---

## Архитектура (FSD)

```
app/        — Next App Router (роуты-обёртки) + провайдеры + глобальные стили
views/      — собранные страницы (FSD-слой "pages", переименован)
widgets/    — крупные блоки страниц
features/   — пользовательские сценарии
entities/   — бизнес-сущности
shared/     — переиспользуемая инфраструктура
```

**Правила импортов** (контролируются `eslint-plugin-boundaries`):

- Слой может импортировать **только из нижестоящих**.
- Внутри слоя — только через Public API слайса (`index.ts`).
- Глубокие импорты типа `@/features/auth/ui/LoginForm/LoginForm.tsx` запрещены.
- `shared/` ничего не знает о бизнес-домене.
- Между слайсами одного слоя прямые импорты запрещены: если нужно — поднимаем общее в `entities/` или `shared/`.

### Структура слайса

```
features/<name>/
├── api/        — хуки query/mutation, схемы Zod
├── model/      — atoms, типы, бизнес-логика
├── ui/         — компоненты
├── lib/        — внутренние утилиты слайса
├── config/     — константы
└── index.ts    — Public API
```

В `index.ts` экспортировать **только** то, что нужно наружу.

### Алиасы

```
@/app/*       → src/app/*
@/views/*     → src/views/*
@/widgets/*   → src/widgets/*
@/features/*  → src/features/*
@/entities/*  → src/entities/*
@/shared/*    → src/shared/*
```

---

## Стили (SCSS)

- **Никакого Tailwind / CSS-in-JS.** Только SCSS Modules + один глобальный файл (`globals.scss`).
- Архитектура в `src/shared/styles/`:
  - `abstracts/` — только переменные, функции, миксины, брейкпоинты. **Никакого CSS-вывода.**
  - `base/palette/` — Radix Colors-шкалы (12 solid + 12 alpha + `-contrast`/`-surface`/`-indicator`/`-track`) для каждой темы и P3.
  - `base/_semantic-tokens.scss` — семантический слой поверх палитры (см. ниже).
  - `base/_root.scss` — `color-scheme` + не-цветовые токены (радиусы, spacing, transitions, z-index).
  - `base/_reset.scss`, `base/_typography.scss` — собственно reset и типографика, потребляют семантику.
- `includePaths` в `next.config.mjs` указывает на `src/shared/styles`, поэтому в любом модуле можно писать:

  ```scss
  @use 'abstracts' as *;

  .root {
    padding: $space-4;             // SCSS-переменная (compile-time)
    color: var(--color-fg);        // семантическая CSS-переменная (runtime)

    @include media-up('md') {
      padding: $space-6;
    }
  }
  ```

- Темизация через `data-theme` на `<html>`. Inline-скрипт в `<head>` (см. `shared/lib/theme-init-script.ts`) ставит атрибут до гидрации — никакого FOUC.
- В компонентах для цветов/радиусов/transition — **CSS-переменные**. SCSS-переменные только там, где значение нужно на этапе компиляции (медиа, math).

### Соглашения по именованию

- `ComponentName.module.scss` рядом с `ComponentName.tsx`.
- Корневой класс: `.root`. Модификаторы: `.root_isActive`, `.root_sizeMd`.
- Объединение классов: `cn` из `@/shared/lib/cn`.

---

## Работа с цветами

В проекте два уровня цветовых токенов:

1. **Сырые токены палитры** — Radix-шкалы (`--blue-9`, `--gray-12`, `--red-a3`, `--blue-contrast`, ...). Генерируются скриптом из `@radix-ui/colors`, лежат в `src/shared/styles/base/palette/`. Используются **только** внутри `src/shared/styles/base/`.
2. **Семантические токены** — `--color-accent-9`, `--color-fg`, `--color-border`, `--color-danger-9` и т.п. Определены в `base/_semantic-tokens.scss` как алиасы на сырые шкалы. **Это единственное, чем должны пользоваться компоненты.**

При переключении `data-theme` меняются значения сырых шкал → семантические токены автоматически следуют за ними. Семантика определена один раз, без дублирования под light/dark.

### Что использовать в компонентах

- Фон / поверхности: `--color-bg`, `--color-bg-subtle`, `--color-panel`, `--color-panel-solid`
- Текст: `--color-fg`, `--color-fg-muted`, `--color-fg-subtle`
- Границы: `--color-border`, `--color-border-strong`, `--color-border-focus`
- Акцент: `--color-accent-{1..12}`, `--color-accent-a{1..12}`, `--color-accent-contrast`, `--color-accent-surface`, `--color-accent-indicator`, `--color-accent-track`
- Состояния: `--color-danger-*`, `--color-warning-*`, `--color-info-*` (см. `_semantic-tokens.scss` — полный список)
- Overlay / focus: `--color-overlay`, `--color-focus-ring`

### Запрещено

```scss
/* ❌ Сырой токен палитры в компоненте */
.button { color: var(--blue-9); }

/* ✅ Семантический токен */
.button { color: var(--color-accent-9); }
```

Stylelint падает на использовании `var(--{yellow|gray|blue|violet|red|cyan}-*)` вне `src/shared/styles/base/`.

### Как сменить бренд-цвет

Поменять один маппинг в `base/_semantic-tokens.scss`:

```scss
--color-accent-9: var(--violet-9);   /* было: var(--blue-9) */
```

…и так для всех `--color-accent-*` (12 ступеней + 12 alpha + 4 служебных). Палитра уже включает шесть готовых шкал.

### Как добавить новую цветовую шкалу

1. Сгенерировать SCSS-файл из `@radix-ui/colors`: добавить имя в массив `COLORS` в `scripts/generate-palette.mjs`, запустить `yarn generate:palette` → появится `base/palette/_<color>.scss`.
2. `base/palette/_index.scss` обновляется автоматически тем же скриптом.
3. При необходимости — добавить семантические алиасы в `_semantic-tokens.scss`.

### Как обновить значения цветов

Не редактировать `base/palette/*.scss` вручную — они генерируются. Обновить версию `@radix-ui/colors` в `package.json`, прогнать `yarn generate:palette` → значения подтянутся.

### P3 / wide-gamut

Каждая шкала автоматически отдаёт P3-варианты в блоке `@supports (color: color(display-p3 1 1 1)) and @media (color-gamut: p3)`. На совместимых дисплеях цвета будут заметно насыщеннее. Проверить можно через DevTools → Rendering → Emulate CSS media feature `color-gamut: p3`.

---

## Как добавить роут / локаль

### Новая локаль

1. Добавить код в `src/shared/i18n/routing.ts` → `locales`.
2. Создать `messages/<code>.json` (скопировать структуру с `en.json`).
3. Обновить `<html lang>` ничего не нужно — берётся из `params.locale`.

### Новая страница

1. Создать `src/views/<page>/` со структурой FSD-слайса.
2. Реэкспортировать `View` через `index.ts`.
3. Создать `src/app/[locale]/.../page.tsx` (тонкая обёртка):

   ```tsx
   import { setRequestLocale } from 'next-intl/server';
   import { MyView } from '@/views/my';

   const Page = async ({ params }: { params: Promise<{ locale: string }> }) => {
     const { locale } = await params;
     setRequestLocale(locale);
     return <MyView />;
   };

   export default Page;
   ```

4. Если нужен SSR-prefetch для TanStack Query — обернуть в `HydrationBoundary` (см. `src/app/[locale]/(marketing)/page.tsx`).

---

## State

- **Client state** — Jotai. Atoms лежат в `model/` соответствующего слайса. Глобальные UI-атомы (theme и т.п.) — в `shared/model/`.
- **Server state** — TanStack Query, **никаких Jotai-атомов под серверные данные**.
- Persisted atoms (`atomWithStorage`) — только для клиентских данных. Учитывать SSR.

---

## API

- HTTP-клиент: `src/shared/api/http.ts` (ofetch). Базовый URL берётся из валидированного `env`.
- Ответы парсятся Zod-схемами на границе слайса (`api/`).
- Дефолты Query: `staleTime: 60s`, `gcTime: 5m`, `retry: 1`, `refetchOnWindowFocus: false`.

---

## Безопасность

Заголовки в `next.config.mjs`:

- HSTS, X-Content-Type-Options, Referrer-Policy, X-Frame-Options, Permissions-Policy.
- CSP — пока в `Content-Security-Policy-Report-Only`, докручивается по мере появления внешних ресурсов.

---

## Что НЕ входит в этот каркас

- UI-kit (`src/shared/ui/` создана пустой).
- Реальные страницы (только демо-главная).
- Реальная авторизация (только заготовка `entities/session`).
- Storybook, аналитика, серверные интеграции.

---

## Git hooks

Husky активируется автоматически после `yarn install` (через скрипт `prepare`).

- `pre-commit` → `lint-staged` (ESLint/Stylelint/Prettier по изменённым файлам).
- `commit-msg` → `commitlint` (conventional commits).
- `pre-push` → `yarn typecheck && yarn test --run`.
