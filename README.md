#### Tech stack:
- Use [React-react-app](https://github.com/facebook/create-react-app) starter kit.
- And some dependencies:
  - [material-ui](https://material-ui.com/): template UI kit
  - [react-router-dom](https://reacttraining.com/react-router/web/guides/quick-start): handle route
  - [formik](https://github.com/jaredpalmer/formik): handle form data
  - [react-pdf](https://github.com/wojtekmaj/react-pdf): display pdf on web
  - others

#### Installation
- Install [node](https://nodejs.org/en/) or [node for Ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-ubuntu-18-04)
- clone this repo
- run: `npm install`

#### Development & Deployment
- make `.env` from `.env.example` and edit REACT_APP_API_URL: the API server URL
  ```
  mv .env.example .env
  vim .env
  ```
- development:
  ```
  $ npm start
  // or
  $ GENERATE_SOURCEMAP=false npm start
  ```
- deploy:
  ```
  $ npm run build
  // or
  $ GENERATE_SOURCEMAP=false npm run build
  ```