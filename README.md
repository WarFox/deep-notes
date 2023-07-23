# Deep Notes

A realtime collaborative notes platform on AWS [Serverless Stack](https://sst.dev/) powered by [Quill](https://quilljs.com/), [Vue](https://vuejs.org/) and [Ably](https://ably.com/).

## Introduction

This app is divided into 3 packages

packages
├── core
├── frontend
└── functions

`core` package contains the domain logic for creating, updating, and listing notes

`frontend` package is a Vue 3 application

`functions` package contains various Lambda functions

All packages are configured to be built and deployed as CloudFormation stack using `sst`.

SST [Resources Binding](https://docs.sst.dev/resource-binding) feature is used
for binding serveless stack together securely to work as a single application.

## Architecture

This app implements serverless architecture and follows domain driven principle.

The following technologies are employed
- Aurora Serverless (Postgres)
- API Gateway V2
- Lambda functions
- VueJS
- Pinia
- Ably Realtime
- AWS Amplify
- Cognito User Pools
- Tailwind CSS

## Deployment

You need to configure AWS Credentials to depoly this application.

```
npm run deploy -- --stage prod
```
Will deploy the application to production stage

## Commands

### `npm run dev`

Starts the Live Lambda Development environment.

### 'cd packages/frontend & npm run dev'

Starts the frontend application.

### `npm run build`

Build your app and synthesize your stacks.

### `npm run deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy, a specific stack.

### `npm run remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.

## Documentation

Learn more about the SST.

- [Docs](https://docs.sst.dev/)
- [sst](https://docs.sst.dev/packages/sst)
- [Read the tutorial](https://sst.dev/examples/how-to-create-a-vuejs-app-with-serverless.html)
- [Learn SST]( https://docs.sst.dev/learn/)
