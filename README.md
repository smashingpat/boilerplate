# Boilerplate

Simple extendable boilerplate, currently fitted for React applications but could be fit to any needs. It uses:

-   **Webpack** for bundling
-   **Babel** for transpiling Typescript and ESNext to compatable browsers
-   **Sass** + **PostCSS**
-   **Browserslist** for managing what files the build should output
-   **Eslint** for linting
-   **Prettier** for code styling
-   **Jest** for unit testing

### Installation

```sh
npm install
```

### Usage

The root sources are `source/main.ts` and `source/shell.html`, here you can start writing your project

```sh
# start the dev-server
npm run start

# build a production ready build, build can be found in the _dist
npm run build

# Check for linting errors, typescript errors and run tests
npm run test
```
