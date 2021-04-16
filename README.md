# Backend Coding Test

## Test 1

- Fork and clone this project locally then begin the test in the repo.
- Develop a backend system using the [NestJS](https://nestjs.com/) and [Serverless](https://serverless.com/) framework that will be deployed on [AWS Lambda](https://aws.amazon.com/lambda/) following the serverless architecture and the microservice principles of NestJS. The database used will be PostgreSQL and interactions with the DB will be through [TypeORM](https://github.com/typeorm/typeorm).
- The backend should provide services that will allow the creation of a user profile on sign up that consist of `name` and `date of birth` which would authenticate with firebase authentication using the [firebase admin library](https://firebase.google.com/docs/admin/setup). Profile data should be stored on a PostgreSQL instance.
- Setup a middleware that validates firebase auth token for each request.
- Setup all other middleware that would commonly be used.
- Create a blog service that allows the creation and management of blog articles which will be stored both on the PostgreSQL instance and on a Firebase firestore instance. All api routes of the blog service should be protected and only accessible through the admin role.
- A public api route should be provided that returns a paginated list of blog articles.
- Develop a CRON Job that will run once a day and will add a random word to the end of each blog title.
- Deploy all work as instructed.

## Extra Points

- Generate an [OpenAPI](https://swagger.io/specification/) documentation for all routes

## Good Job!

After completing the coding test, please provide the details listed below:

- API route links and Open API documentation
- Public github link for all test completed
- Any other information required to run and access the project such as environment keys (`.env`) and admin login

## Learn More

To learn more about some of the technologies used, take a look at the following resources:

- [Nest.js Documentation](https://docs.nestjs.com/)
- [Dayjs](https://day.js.org/)
- [Serverless](https://www.serverless.com/framework/docs/)
- [AWS Lambda](https://aws.amazon.com/lambda/getting-started/)
- [PostgreSQL](https://www.postgresql.org/)
- [ElephantSQL](https://www.elephantsql.com/docs/index.html)
