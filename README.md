# Schoolbag

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.6.
API is written with Node.js Express framework. API source code is inside `api` directory.

## Run Angular app in development mode

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Run API server

Run `npm start` from `api` directory to start the API server. 
Run `npm run startdev` from `api` directory to start the API server for development.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running Angular app unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running API tests

Run `npm run test-dev` from `api` directory to execute the tests for API.

## Deploy

Run `docker-compose up -d` to deploy the application using docker.
This will run 3 docker containers.
* Mongo container runs database for the application.
* Nginx container serves Angular application.
* Node.js container to run express API.

Navigate to `http://localhost/` to access the application.

