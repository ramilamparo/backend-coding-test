import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
	service: "backend-coding-test",
	useDotenv: true,
	frameworkVersion: "2",
	custom: {
		webpack: {
			webpackConfig: "./webpack.config.js",
			includeModules: true
		}
	},
	plugins: ["serverless-webpack", "serverless-offline"],
	provider: {
		name: "aws",
		runtime: "nodejs14.x",
		apiGateway: {
			minimumCompressionSize: 1024,
			shouldStartNameWithService: true
		},
		environment: {
			AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1"
		},
		lambdaHashingVersion: "20201221"
	},
	functions: {
		main: {
			handler: "src/lambda.handler",
			events: [
				{
					http: {
						method: "ANY",
						path: "/{any+}"
					}
				}
			]
		},
		blogPostUpdater: {
			handler: "src/cron/blogpost.handler",
			events: [
				{
					schedule: "cron(0 0 * * *)"
				}
			]
		}
	}
};

module.exports = serverlessConfiguration;
