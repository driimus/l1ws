FROM node:erbium-alpine

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install bcrypt prerequisites
RUN apk add --no-cache --virtual .build-deps-full \
	binutils-gold \
	g++ \
	gcc \
	gnupg \
	libgcc \
	linux-headers \
	make \
	python

# Install webserver dependencies
RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD ["npm", "start"]
