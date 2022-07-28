# BN Template Engine


## Description
A simple web service that can be used as a templating engine. It contains an `src` and `mock-server` directory. The `src` directory contains the code for the templating engine. The `mock-server` is a simple mock server of the existing microservice, so the application could be developed without an internet connection.

The application has one endpoint `http://SERVER_URL/resolve`. You can send a `POST` request to this endpoint, containing a body with an input as a string. The server will resolve any tags within the string e.g. `"Hello, $(firstname:1)"` -> `"Hello, Eoan"`.

Available tags include `name`, `firstname`, `lastname`, `email`, `parent`, `child`.

### Recommended to run this code
1. Node (17.4.0)
2. NPM (8.3.1)

### How to run this code
1. Clone this repository to your local machine.
2. Run `cp .env.example .env` and fill in `EXISTING_MICROSERVICE_URL` and `CORS_ORIGIN`. (If you want to use the local mock server, leave the `EXISTING_MICROSERVICE_URL` as is.)
3. Run `npm install` to install the dependencies
4. Run `npm run dev` to run the application in development
5. Run `npm run build` to build the application
6. (OPTIONAL) Run `npm run mock:dev` to run the mock server in development
7. (OPTIONAL) Run `npm run mock:start` to run the mock server

### Live Demo
There is a live version of this application located [here](https://http-nodejs-production-e6f3.up.railway.app)
