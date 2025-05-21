# PULSE Insights Tool

https://web.engr.oregonstate.edu/~letawl/pulse/

## 🚀 Tech Stack

- [Vite](https://vitejs.dev/) — Fast frontend tooling
- [React](https://react.dev/) — UI library
- [TypeScript](https://www.typescriptlang.org/) — Type safety
- [Vitest](https://vitest.dev/) — Unit testing framework
- [Jotai](https://jotai.org/) — Atomic state management (if you're using it)
- ESLint + Prettier — Linting and code formatting
- GitHub Actions — Automated CI (test on PRs)

---

## 📦 Installation

**Ensure you're using the specified node version by installing [nvm](https://github.com/nvm-sh/nvm) and then run** (or do a manual check)

```
nvm use
```

**Install packages**

```bash
yarn install
```
or
```bash
npm install
```

## 🛠 Development

```bash
yarn dev
```
or
```bash
npm run dev
```

Runs the app locally at http://localhost:5173.

## 🏗 Build for Production

```bash
yarn build
```
or
```bash
npm run build
```

Outputs static files to the /dist folder.

## 🧪 Run Tests

```bash
yarn test
```
or
```bash
npm run test
```

Tests are powered by [Vitest](https://vitest.dev/).

## 🧹 Project Structure

```
src/
├── atoms/               # Jotai atoms for shared state
├── components/          # React components
├── constants/           # Shared static constants
├── hooks/               # Custom React hooks
├── types/               # Global TypeScript types
├── utils/               # Helper functions and utilities
├── App.tsx              # Main App component
├── main.tsx             # App entry point
```
