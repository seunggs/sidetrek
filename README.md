# Boilerplate

This is a boilerplate project for:

* React/Redux/React-router
* Node/graphql-yoga
* Prisma/Graphql/Postgres


## Project structure

* Node server lives in the root folder with all its files living in /src
  * schema.graphql holds the datamodel for the Node server, which are the queries/mutations/subscriptions available to the client
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


## Get started

1. Follow the setup instructions below before proceeding!
2. To deploy and run dev: 
  1. Prisma: `npm run deploy:prisma:dev`
  2. First make sure docker is running in /prisma: `cd prisma && docker-compose up -d`
  3. Go back to the root folder and then run `npm run dev`
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


## 1) Prisma Dev Server Setup Instructions

1. Clone the repository and create a new git repo.
2. Run `yarn install` and then run `yarn upgrade`.
3. Create /config and create dev.env, test.env, and prod.env
  * dev.env example: 
    ```
    PRISMA_ENDPOINT=http://localhost:4466/default/dev
    PRISMA_SECRET=fijoasd89i3jrkek
    JWT_SECRET=df9j28ifjs78ryoh
    ```
  * test.env example: 
    ```
    PRISMA_ENDPOINT=http://localhost:4466/default/test
    PRISMA_SECRET=fijoasd89i3jrkek
    JWT_SECRET=df9j28ifjs78ryoh
    ```
  * prod.env example: 
    ```
    PRISMA_ENDPOINT=[to be entered later once Prisma prod server is deployed]
    PRISMA_SECRET=23iokfdjs0a9j13
    JWT_SECRET=90iosfjgaishlok8
    ```
  * Note: dev.env and test.env can have same values for PRISMA_SECRET, JWT_SECRET
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
12. Check localhost:4466 (default port) to see if it's graphql playground is working properly. (if localhost doesn't work, try 127.0.0.1 after changing the endpoint in prisma.yml)


## 2) Production Database & Prisma Docker Container (DB & Prisma Server) Setup Instructions

1. Sign up for Prisma Cloud.
2. Create servers (DB and Prisma Server) via Heroku by following the instructions.
3. Create a service so we can deploy the datamodel to the server created above. 
  1. Run `cd prisma` and then `prisma login`. Then click "Grant Permission".
  2. Run `prisma deploy -e ../config/prod.env`
  3. Move the "endpoint" filled out in prisma.yml to PRISMA_ENDPOINT in /config/prod.env and uncomment "endpoint" in prisma.yml.
  4. Run `prisma deploy -e ../config/prod.env` again to check if all went well (you should see "Service is already up to date.").
  5. Check Prisma Cloud to see if the Service has been created.


## 3) Node application Hosting Setup Instructions

1. Run `npm i heroku -g` if it doesn't already exist.
2. Run `heroku login`.
3. Create both staging and production server in Heroku.
3. Set up a pipeline in Heroku and connect the staging server to git repo for the project.
4. Push to git to deploy to staging server and then promote it to prod server.

## 4) (Optional) Identity Provider Auth Setup Instructions

* Google:
  1. Add ENV variables for GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in /config/dev.env


## 5) (Optional) Update create-react-app

* Create-react-app is not ejected, so feel free to update it. See this page for the instruction: https://github.com/facebook/create-react-app/blob/master/CHANGELOG.md