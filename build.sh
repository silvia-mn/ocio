#!/bin/bash

cd backend
npm install
npm run server &
cd ../frontend
npm install --force
npm run start &

