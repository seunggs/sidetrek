# Boilerplate

This is a boilerplate project for:

* React/Redux/React-router
* Node/graphql-yoga
* Prisma/Graphql/Postgres


## Project structure

* Node server lives in the root folder with all its files living in /src
  * schema.graphql holds the datamodel for the Node server, which are the queries/mutations/subscriptions available to the client
    * Putting `# import * from './generated/prisma.graphql'` simply flows through all ops from generated Prisma schema from datamodel.graphql
    * NOTE: But it seems still required to specify Query and Mutation types for some reason (?)
  * Running `npm run get-schema` in root folder gets the Prisma graphql schema (generated Prisma schema from datamodel.graphql) as specified by /.graphqlconfig (it tells us where the source Prisma schema lives and where the generated schema should be saved) and make the entire Prisma schema available to our Node server via prisma-binding (i.e. `prisma.query`)
* Prisma server lives in /prisma
  * datamodel.graphql holds the datamodel for the Prisma server
  * Running `prisma deploy` in /prisma generates the full graphql schema (i.e. CRUD for all types) based on /prisma/datamodel.graphql and deploys to the Prisma server
* Client lives in /client folder - set up by running `npx react-create-app client` in the root folder
* /config has all the ENV variables - dev & test should have same values except for PRISMA_ENDPOINT
* Ports
  * Client: 3000
  * Node server: 4000 (should see graphql playground)
  * Prisma server: 4466 (should see graphql playground - it's directly connected to DB)
* Authentication & Authorization (Auth0)
  * Auth strategy:
    * New login sessions are executed in Auth0 servers (via auth0-js library) and sent back to /callback route (for all strategies - i.e. including Identity Providers).
    * Renewal of sessions are also checked in Auth0 servers on App load
  * Ultimately, two places handle authentication logic:
    1. App.js `checkAuth()`: checks to see if "loggedIn" exists in localStorage and renews the sessions via Auth0.
      * This handles the cases where user is already logged in from previous visits
      * Authentication state is saved in Redux store once returned
    2. /callback route: all Auth0 login is sent back to this route after authenticating and CallBack component handles authentication logic.
      * This handles the cases where user logs in
      * Authentication state is saved in Redux store once returned
  * /utils/auth.js:
    * `setSession()` sets the auth session for the user by saving `isLoggedIn` in localStorage and setting expiresAt, idToken, and accessToken in Redux store which is used to handle authentication throughout the app
    * For API calls, `setAuthHeader()` in /client/utils/auth.js sets the token in axios header
  * Automatic token renewal:
    * The token expiry is set to 2 hours - but for the convenience of the users, the token will autorenew based on token expiry until logout
  * API authorization:
    * Send the access token (jwt when API is setup in Auth0) in Authorization Header in Axios for all calls and backend checks for the validity of the token (using RS246)
  * User profile (& auth info):
    * The single source of truth for auth is Auth0. The single source of truth for user info (i.e. profile) is in our own DB (User table). On Auth0 authentication, all user auth & profile data from Auth0 is copied to our own DB. Any updates should be done to our own DB to retrieve & update profile related info.
    * For updating/deleting user auth (not profile), calls should be made to both our own DB and Auth0
    * IMPORTANT: uid field in our DB matches Auth0 id


## Get started

1. Follow the setup instructions below before proceeding!
2. To deploy and run dev: 
  1. First make sure docker is running in /prisma: `cd prisma && docker-compose up -d & cd ..` (this runs the server at localhost:4466)
  2. Prisma: `npm run deploy:prisma:dev`
  3. Go back to the root folder and then run `npm run dev`
  4. To run the Graphql Playground (localhost:4466/default/dev), set the Authorization header in the browser (obtain the token using `prisma token -e ../config/dev.env`)
3. To deploy test:
  1. Prisma: `npm run deploy:prisma:test`
5. To deploy to production:
  1. Node: 
    1. Make sure all ENV variables are set in Heroku: 
      * Add server ENVs: /config/*.env
      * Add client ENVs: /client/.env.development
    2. Push everything to the staging server in git (make sure Heroku pipeline is set up):
      1. `git commit -am "deploy"`
      2. `git push`
      3. Lastly, promote it to prod if staging looks good
  2. Prisma: `npm run deploy:prisma:prod`
  3. To run the Graphql Playground (see PRISMA_ENDPOINT in /config/prod.env), set the Authorization header in the browser (obtain the token using `prisma token -e ../config/prod.env`)
6. To analyze the CRA bundle size:
  1. Inside /client, run: `npm run build`
  2. Open /build/bundle-stats.html


## 1) Prisma Dev Server Setup Instructions

1. Clone the repository and create a new git repo.
2. Run `yarn install` and then run `yarn upgrade`.
3. Create /config and create dev.env, test.env, and prod.env
  * dev.env example: 
    ```
    PRISMA_ENDPOINT=http://localhost:4466/default/dev
    PRISMA_SECRET=djfa89jpf2ijro
    PRISMA_SERVER_HOST=localhost
    JWT_SECRET=vkljxp89qpifkd7
    ```
  * test.env example: 
    ```
    PRISMA_ENDPOINT=http://localhost:4466/default/test
    PRISMA_SECRET=djfa89jpf2ijro
    PRISMA_SERVER_HOST=localhost
    JWT_SECRET=vkljxp89qpifkd7
    ```
  * prod.env example: 
    ```
    PRISMA_ENDPOINT=[to be entered later once Prisma prod server is deployed]
    PRISMA_SECRET=m9rdkas810dk389
    PRISMA_SERVER_HOST=0.0.0.0
    JWT_SECRET=gj8ape2jiflh89
    ```
  * Note: dev.env and test.env can have same values for PRISMA_SECRET, JWT_SECRET
  * Add other env variables
    ```
    AUTH0_CLIENT_ID
    AUTH0_CLIENT_SECRET
    AUTH0_MANAGEMENT_API_CLIENT_ID
    AUTH0_MANAGEMENT_API_CLIENT_SECRET
    AWS_ACCESS_KEY_ID
    AWS_SECRET_ACCESS_KEY
    AWS_BUCKET
    AWS_ENDPOINT
    ```
4. Setup Heroku server for "X-prisma-dev" and add an add-on called "Heroku Postgres".
5. Download and open pgAdmin and create a new server for "X-prisma-dev". Fill out the server details from Heroku Postgres settings.
6. Download and run Docker app.
7. Run `npm i prisma -g` if Prisma doesn't exist globally already.
8. Inside the root folder, run: `prisma init prisma`.
  1. Select "Use existing database"
  2. Postgres
  3. No (empty db)
  4. Fill out the connection info from Heroku Postgres (use SSL)
  5. pick "Don’t generate" for language selection for prisma client
9. Add `secret: ${env:PRISMA_SECRET}` to prisma.yml and update "endpoint" to `${env:PRISMA_ENDPOINT}`.
10. Add `ssl: true` below `user` in docker-compose.yml.
11. Follow the next steps as prompted with one exception (step 3):
  1. `cd prisma`
  2. `docker-compose up -d` (run the Prisma service locally)
  3. `prisma deploy -e ../config/dev.env` (deploy the code to the Docker Prisma service)
  * NOTE: If there's a connection issue (i.e. Could not connect to server at http://localhost:4466), try `docker-compose down -v --rmi all --remove-orphans` to completely remove the docker container and retry
12. Check localhost:4466 (default port) to see if it's graphql playground is working properly. (if localhost doesn't work, try 127.0.0.1 after changing the endpoint in prisma.yml)
13. Update the /prisma/datamodel.prisma to:
  ```
  type User {
    id: ID! @unique
    email: String! @unique
    name: String
    username: String @unique
    picture: String
    updatedAt: DateTime!
    createdAt: DateTime!
  }
  ```
14. Update /src/schema.graphql
  * Copy 'type Query' and 'type Mutation' from /generated/prisma.graphql 
15. Update /client/utils/constants.js and /src/utils/constants.js


## 2) Production Database & Prisma Docker Container (DB & Prisma Server) Setup Instructions

1. Sign up for Prisma Cloud.
2. Create servers (DB and Prisma Server) via Heroku by following the instructions.
3. Create a service so we can deploy the datamodel to the server created above. 
  1. Run `cd prisma` and then `prisma login`. Then click "Grant Permission".
  2. Run `prisma deploy -e ../config/prod.env`
  3. Move the "endpoint" filled out in prisma.yml to PRISMA_ENDPOINT in /config/prod.env and uncomment "endpoint" in prisma.yml.
  4. Run `prisma deploy -e ../config/prod.env` again to check if all went well (you should see "Service is already up to date.").
  5. Check Prisma Cloud to see if the Service has been created.


## 3) Node Setup Instructions

1. Update CORS info in ./src/index.js


## 4) Node Application Hosting Setup Instructions

1. Run `npm i heroku -g` if it doesn't already exist.
2. Run `heroku login`.
3. Create both staging and production server in Heroku.
4. Set up a pipeline in Heroku and connect the staging server to git repo for the project.
5. Push to git to deploy to staging server and then promote it to prod server.


## 5) Authentication/Authorization Setup

1. Add ENV vars for Auth0 in server: /config/*.env -> AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET
2. Add ENV vars for Auth0 in client: /client/.env.* -> REACT_APP_AUTH0_CLIENT_ID, REACT_APP_AUTH0_CLIENT_SECRET
3. Update URLS in ./client/utils/constants.js.
4. Add a Rule in Auth0 (note that the APP_URL below should match the one in constants above):
  ```javascript
  function (user, context, callback) {
    user.user_metadata = user.user_metadata || {};
    context.idToken['[APP_URL]/email'] = user.email;
    context.idToken['[APP_URL]/name'] = user.user_metadata.name;
    context.accessToken['[APP_URL]/email'] = user.email;

    auth0.users.updateUserMetadata(user.user_id, user.user_metadata)
      .then(function(){
          callback(null, user, context);
      })
      .catch(function(err){
          callback(err);
      });
  }
  ```
5. Set up a new API in Auth0 Dashboard for the app and authorize Machine to Machine Applications with read:users, update:users, and delete:users scopes
6. All related account signups with the same address (i.e. email-password + Google Login + Twitter Login) will be merged into a single account in our DB with the unique key of email.

## 6) (Optional) Update create-react-app

* Create-react-app is not ejected, so feel free to update it. See this page for the instruction: https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md