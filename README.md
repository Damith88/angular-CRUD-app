# Schoolbag

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 10.0.6.
API is written with Node.js Express framework. API source code is inside `api` directory.
MongoDB is used as the database management system.

## Run Angular app in development mode

Run `npm start` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Run API server

Run `npm start` from `api` directory to start the API server. 
Run `npm run startdev` from `api` directory to start the API server for development.
API documentation can be accessed via `http://localhost:3000/api/docs`.
[Swagger](https://swagger.io/) is used for documenting the API.

## Populate test data

To populate test data you may run `populateSchools.js` script under `api/devScripts`.  
Ex:- `node populateSchools.js <mongo_connection_string> <source_json_file>`  
Sample data file is included in the directory. [source](http://det.wa.edu.au/schoolinformation/detcms/navigation/school-lists/)

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running Angular app unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running API tests

Run `npm run test-dev` from `api` directory to execute the tests for API.

## Running end to end (e2e) tests

* Run `docker-compose -f docker-compose.yml -f docker-compose.test.yml up api` from root directory to start the test API.
* Run `node populateSchools.js mongodb://127.0.0.1:27017/schoolbagtest?retryWrites=true ../../e2e/test-data.json --drop-collection` from `api/devScripts` directory to populate initial data for testing.
* Run `npm e2e` from root directory to start the angular app in development mode run the e2e tests.

## Deploy

Run `docker-compose up -d` to deploy the application using docker.
This will run 3 docker containers.
* Mongo container runs database for the application.
* Nginx container serves Angular application.
* Node.js container to run express API.

Navigate to `http://localhost/` to access the application.

