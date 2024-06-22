# to build, I had to use: https://github.com/abiosoft/colima/discussions/273#discussioncomment-6453101
# Use the latest LTS version of Node.js on Alpine Linux
FROM node:lts-alpine

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy only the compiled JavaScript files from the dist directory
COPY dist/index.js .

# Set the default command to run your Node.js application
CMD ["node", "index.js"]
