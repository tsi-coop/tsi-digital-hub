#!/bin/bash

# Source the .env file to load variables into the current shell session
# Adjust path if .env is not in the same directory as the script
if [ -f ./.env ]; then
    source ./.env
else
    echo "Error: .env file not found. Please create it."
    exit 1
fi

export JAVA_HOME=$JAVA_HOME
export TSI_AADHAR_VAULT_PLUS_ENV=$TSI_AADHAR_VAULT_PLUS_ENV
export TSI_AADHAR_VAULT_PLUS_HOME=$TSI_AADHAR_VAULT_PLUS_HOME
export POSTGRES_HOST=$POSTGRES_HOST
export POSTGRES_DB=$POSTGRES_DB
export POSTGRES_USER=$POSTGRES_USER
export POSTGRES_PASSWD=$POSTGRES_PASSWD
export JETTY_HOME=$JETTY_HOME
export JETTY_BASE=$JETTY_BASE
export TSI_DIGITAL_HUB_HOME=$TSI_DIGITAL_HUB_HOME
export TSI_DIGITAL_HUB_ENV=$TSI_DIGITAL_HUB_ENV
export ZOHO_API_HOST=$ZOHO_API_HOST
export ZOHO_AUTH_KEY=$ZOHO_AUTH_KEY
export SENDER_EMAIL=$SENDER_EMAIL
export SENDER_NAME=$SENDER_NAME
cp %TSI_DIGITAL_HUB_HOME%\target\tsi_digital_hub.war %JETTY_BASE%\webapps\ROOT.war
java -jar $JETTY_HOME/start.jar