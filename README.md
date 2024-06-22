# Albus

> "A wizard is never late, nor early, he is. Precisely when he means to arrive, he does." - Albus the cyber otter

## Running locally

To run locally, you need to do 3 things.

- Pick your target Slack workspace and make your `.env` file
- Spin up a local copy of DynamoDB
- Run the server locally, either through VS Code Debug (F5) or detached as a Docker container (useful before going to production)

//TODO: Make and talk about example environment files here somewhere.

To run the server locally (step 3 above), run `npm run build` which will have ESBuild watching for your changes. When you're ready to re-connect to your Slack workspace, use VS Code's F5 debug function to actually start the app. Breakpoints work if you do this.

### Running locally with Docker

//TODO: Add a `docker-compose` file to bundle this better.

You're going to need a local copy of DynamoDB. To get that:

- `docker pull amazon/dynamodb-local`
- `docker run -p 8000:8000 amazon/dynamodb-local`

Then after that, you can build and run the image with these commands:

- `docker build -t docker.pkg.github.com/hughsername/albus/client:node-dynamo .`
- `docker run -d --add-host host.docker.internal=host-gateway --env-file .env docker.pkg.github.com/hughsername/albus/client:node-dynamo`
