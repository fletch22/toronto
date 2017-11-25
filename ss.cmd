@echo off

SET BUILD_FOLDER_NAME=build-server
SET BUILD_DIR=%cd%\%BUILD_FOLDER_NAME%

IF EXIST %BUILD_DIR% (
    echo 'Removing build-server directory.'
    rmdir %BUILD_DIR% /s /q
)

node_modules/.bin/babel-watch ./src/server/serverNew.js
