aws-lambda-webhook
------------------
This repo contains AWS Lambda webhook glue for use between SaaS providers. The first commit is based on pushing Pingdom incident alerts into HipChat, but the idea is that this will grow to encompass additional integrations.

The Lambda expects a `config.js`, so you'll need to `cp config.js.sample config.js` and set valid values for your setup.

Because much of the complexity is in the configuration of AWS API Gateway, please see this blog post for the full story: http://blog.lanyonm.org/articles/2015/11/25/pingdom-hipchat-integration-aws-lambda.html.

Packaging
---------
Because this Lambda is more than one Node.js file you'll need to zip & upload the code. Make sure to run the zip command from the repo root:

	zip -r lambda-webhook.zip *.js

_Please note: The entry point to your Lambda function must be in the root of the zip!_

Testing
-------
There aren't any automated test, but here's some sample curl statements for each integration:

#### Pingdom to HipChat

	curl -H 'X-Request-Id: 6645779c-18a9-473d-808e-2b74450c7347' https://1x1x1x1x1x.execute-api.us-east-1.amazonaws.com/prod/pingdom-webhook?message=%7B%22check%22%3A%20%221834565%22%2C%20%22checkname%22%3A%20%22just%20a%20test%22%2C%20%22host%22%3A%20%22www.example.com%22%2C%20%22action%22%3A%20%22assign%22%2C%20%22incidentid%22%3A%208765%2C%20%22description%22%3A%20%22down%22%7D

License
-------
MIT
