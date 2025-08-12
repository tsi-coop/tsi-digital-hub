@echo off
setlocal

title TSI Aadhaar Vault Plus
:: Check if .env file exists
if not exist ".env" (
    echo Error: .env file not found. Please create it.
    exit /b 1
)

:: Parse .env file line by line
:: /F "tokens=1* delims==" means:
:: - read each line
:: - "tokens=1*" splits the line at the first '='
::   - token 1 gets the part before '=' (the variable name)
::   - token * gets all the rest of the line (the value), including spaces
:: - "delims==" specifies that '=' is the delimiter
for /f "tokens=1* delims==" %%A in (.env) do (
    :: Check if the line is not empty and not a comment (starts with #)
    if not "%%A"=="" (
        if not "%%A"=="::" (
            if not "%%A"=="#" (
                :: Set the environment variable
                set "%%A=%%B"
            )
        )
    )
)

set JAVA_HOME=%JAVA_HOME%
set TSI_DIGITAL_HUB_ENV=%TSI_DIGITAL_HUB_ENV%
set TSI_DIGITAL_HUB_HOME=%TSI_DIGITAL_HUB_HOME%
set POSTGRES_HOST=%POSTGRES_HOST%
set POSTGRES_DB=%POSTGRES_DB%
set POSTGRES_USER=%POSTGRES_USER%
set POSTGRES_PASSWD=%POSTGRES_PASSWD%
set JETTY_HOME=%JETTY_HOME%
set JETTY_BASE=%JETTY_BASE%
set TSI_DIGITAL_HUB_HOME=%TSI_DIGITAL_HUB_HOME%
set TSI_DIGITAL_HUB_ENV=%TSI_DIGITAL_HUB_ENV%
set ZOHO_API_HOST=%ZOHO_API_HOST%
set ZOHO_AUTH_KEY=%ZOHO_AUTH_KEY%
set SENDER_EMAIL=%SENDER_EMAIL%
set SENDER_NAME=%SENDER_NAME%
copy %TSI_DIGITAL_HUB_HOME%\backend\target\tsi_digital_hub.war %JETTY_BASE%\webapps\ROOT.war >NUL
java -jar %JETTY_HOME%/start.jar
