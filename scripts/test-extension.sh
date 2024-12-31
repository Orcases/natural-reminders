#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}Starting Natural Reminders extension test...${NC}"

# Step 1: Build the extension
echo -e "\n${GREEN}Building extension...${NC}"
npm run build

if [ $? -ne 0 ]; then
    echo -e "${RED}Build failed! Please fix the errors and try again.${NC}"
    exit 1
fi

# Step 2: Check if build directory exists
if [ ! -d "build" ]; then
    echo -e "${RED}Build directory not found! Make sure the build process completed successfully.${NC}"
    exit 1
fi

# Step 3: Start development server
echo -e "\n${GREEN}Starting development server...${NC}"
npm run dev &
DEV_SERVER_PID=$!

# Function to cleanup on exit
cleanup() {
    echo -e "\n${GREEN}Cleaning up...${NC}"
    kill $DEV_SERVER_PID
    exit 0
}

# Set up cleanup on script exit
trap cleanup SIGINT SIGTERM

echo -e "\n${GREEN}Test environment ready!${NC}"
echo -e "Please follow these steps to test the extension:"
echo -e "1. Open Chrome and go to ${GREEN}chrome://extensions/${NC}"
echo -e "2. Enable ${GREEN}Developer mode${NC} (toggle in top-right)"
echo -e "3. Click ${GREEN}Load unpacked${NC} and select the ${GREEN}build${NC} directory"
echo -e "4. The extension should now be loaded and ready for testing"
echo -e "\nPress Ctrl+C to stop the development server\n"

# Keep script running
wait $DEV_SERVER_PID
