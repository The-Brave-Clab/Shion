# Shion

**Shion** is an archive viewer for the mobile application [ゆゆゆ勇者部](https://c-rayon.com/result/yuyuyu/) which has been discontinued on March 31, 2025.

> 結城友奈は勇者であるオフィシャルアプリ「ゆゆゆ勇者部」は 2025/3/31 をもってサービスを終了させていただくこととなりました。
>
> 短い期間ではございましたが、ご愛顧いただき誠にありがとうございました。
>
> ...

## Setup

Place the files you downloaded using [yyyysb-python](https://github.com/The-Brave-Clab/yyyysb-python) into the `public/data` directory as follow:

```
Shion/public
└──data
   ├──article
   ├──choice
   ├──information
   ├──informationCategory
   ├──photo
   ├──poll
   ├──thumbnail
   ├──tlPost
   ├──user
   ├──video
   └──vimeo
```

Or add the environment variable `NUXT_PUBLIC_BASE_URL`, which will be appended before the path as an endpoint for loading resources like videos.

```bash
# Example
NUXT_PUBLIC_BASE_URL="http://localhost:3000"
# The endpoint will be:
"http://localhost:3000/data/tlPost/:id/data.json"
```

Remember to always perform either of the two actions above, otherwise you will have problems building or loading resources.

Make sure to install dependencies:

```bash
# npm
npm install

# pnpm
pnpm install

# yarn
yarn install

# bun
bun install
```

## Development Server

Start the development server on `http://localhost:3000`:

```bash
# npm
npm run dev

# pnpm
pnpm dev

# yarn
yarn dev

# bun
bun run dev
```

## Production

Build the application for production:

```bash
# npm
npm run build

# pnpm
pnpm build

# yarn
yarn build

# bun
bun run build
```

Locally preview production build:

```bash
# npm
npm run preview

# pnpm
pnpm preview

# yarn
yarn preview

# bun
bun run preview
```

Check out the [deployment documentation](https://nuxt.com/docs/getting-started/deployment) for more information.

## Todo

- Pages to be implemented
  - [x] Timeline
  - [ ] Article
  - [ ] Information
  - [ ] Video
