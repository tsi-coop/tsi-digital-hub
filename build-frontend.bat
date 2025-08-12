@echo off

echo Starting Frontend Build

pushd %~dp0
setLocal EnableDelayedExpansion

cd frontend
npm run build

endlocal
:: Return to the previous directory
popd