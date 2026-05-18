#!/bin/bash
set -e

echo "=========================================="
echo "     SkillForge LMS Build & Run Script    "
echo "=========================================="

# Check commands
if ! command -v npm &> /dev/null; then
    echo "Error: npm could not be found."
    exit 1
fi

if ! command -v mvn &> /dev/null; then
    echo "Error: maven (mvn) could not be found."
    exit 1
fi

echo -e "\n[1/4] Installing Frontend Dependencies..."
cd frontend
npm install
cd ..

echo -e "\n[2/4] Building Backend..."
cd backend
mvn clean install -DskipTests
cd ..

echo -e "\n[3/4] Starting Spring Boot Backend in background..."
cd backend
mvn spring-boot:run &
BACKEND_PID=$!
cd ..

echo -e "\n[4/4] Starting React Frontend..."
cd frontend
npm run dev

# Trap SIGINT to kill backend process when stopping frontend
trap "kill $BACKEND_PID" SIGINT SIGTERM EXIT
