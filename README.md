# KMITL Bachelor's Project
## Freight Management Systems

## Technologies Used

- [Nextjs](https://nextjs.org/) - Next.js is a flexible React framework that gives you building blocks to create fast, full-stack web applications.
- [Typescript](https://www.typescriptlang.org/) - TypeScript extends JavaScript by adding types to the language
- [Node.js](https://nodejs.org/en/) - Node.js® is a JavaScript runtime built on Chrome's V8 JavaScript engine.
- [Yarn](https://yarnpkg.com/) - Yarn is a package manager that doubles down as project manager.

## Getting Started

Install package:

```bash
yarn install
```

First, run the development server:

```bash
yarn dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

## Build step

#### build image

```bash
docker build --no-cache --progress=plain -t management-front-end .
```

#### run image

```bash
docker run -d -p 3001:3000 management-front-end
```
