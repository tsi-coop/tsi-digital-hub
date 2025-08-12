@echo off

echo Starting Backend Build
:: Save the current directory
pushd %~dp0
setLocal EnableDelayedExpansion

cd backend
mvn clean install

endlocal
:: Return to the previous directory
popd
