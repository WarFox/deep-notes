# Deep Notes

A realtime collaborative notes platform on AWS [Serverless Stack](https://sst.dev/) powered by [Quill](https://quilljs.com/), [Vue](https://vuejs.org/) and [Ably](https://ably.com/).

## Introduction

This app is divided into 3 packages

```
packages
├── core
├── frontend
└── functions
```

`core` package contains the domain logic for creating, updating, and listing notes

`frontend` package is a Vue 3 application

`functions` package contains various Lambda functions

All packages are configured to be built and deployed as CloudFormation stack using `sst`.

SST [Resources Binding](https://docs.sst.dev/resource-binding) feature is used
for binding serveless stack together securely to work as a single application.

## Architecture

This app is implemented using serverless technologies and follows domain driven design.

The following technologies are employed
- ~~[Aurora Serverless](https://aws.amazon.com/rds/aurora/serverless/) (Postgres)~~
- [DynamoDB](https://aws.amazon.com/dynamodb/)
- [API Gateway](https://aws.amazon.com/api-gateway/)
- [AWS Lambda](https://aws.amazon.com/lambda/)
- [VueJS](https://vuejs.org/)
- [Pinia](https://pinia.vuejs.org/)
- [Ably Realtime](https://ably.com/)
- [AWS Amplify Vue UI](https://ui.docs.amplify.aws/vue/getting-started/introduction)
- [Cognito User Pools](https://docs.aws.amazon.com/cognito/latest/developerguide/cognito-user-identity-pools.html)
- [Tailwind CSS](https://tailwindcss.com/)

## Features

- Full SignIn/SingUp workflow including
  - [x] Registration
  - [x] Email verification
  - [x] Password chhecking
  - [x] Forgot password
- Notes API
  - [x] List notes
  - [x] Get single note
  - [x] Create note
  - [x] Update note
  - [x] Delete note
- Notes UI
  - [x] List notes
  - [x] Get single note
  - [x] Create note
  - [ ] Update note
  - [ ] Delete note
- Realtime
  - [x] Connetion to Ably
  - [x] Realtime character updates to all participants
  - [x] AvatarStack to show all participants
  - [x] Indicator to show realtime connection
  - [x] Indicator for participants who left collaboration
  - [ ] Realtime cursors for all participants
- Authorization
  - [x] JWT based authorisation for all API endpoints
- Editor
  - [x] Quill
- Conflict resolution
  - [ ] CRDT (Conflict-free Replicated Data Type)
- CI/CD
  - [x] Local test setup
  - [ ] CI Test setup
  - [ ] Feature branch deployment
  - [ ] Main branch deployment

## Deployment

You need to configure AWS Credentials to depoly this application.

```
npm run deploy -- --stage prod
```
Will deploy the application to production stage

## Development

Packages and workspaces are managed by `pnpm`, please make sure you have `pnpm`
setup in your machine.

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
