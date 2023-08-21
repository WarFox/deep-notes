#!/usr/bin/env bash

COGNITO_APP_CLIENT_ID=`jq -r '."dev-deep-notes-Auth".UserPoolClientId' .sst/outputs.json`
COGNITO_USER_POOL_ID=`jq -r '."dev-deep-notes-Auth".UserPoolId' .sst/outputs.json`
USER_NAME=hello@deepnotes.io

set -x

aws cognito-idp sign-up \
    --client-id $COGNITO_APP_CLIENT_ID \
    --username $USER_NAME \
    --password P@ssw0rd!

echo "User created"

aws cognito-idp admin-confirm-sign-up \
    --user-pool-id $COGNITO_USER_POOL_ID \
    --username $USER_NAME

echo "Confirm user"

aws cognito-idp admin-update-user-attributes \
    --user-pool-id $COGNITO_USER_POOL_ID \
    --username $USER_NAME \
    --user-attributes Name=email_verified,Value=true

echo "Confirm email"
