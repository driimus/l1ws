FROM node:12-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install bcrypt prerequisites
RUN apt-get update && apt-get install build-essential python -y
# Install dependencies
RUN npm i

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "start"]
