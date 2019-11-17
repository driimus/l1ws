FROM node:12-slim

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json if available
COPY package*.json ./

# Install bcrypt and headless Chrome prerequisites
RUN wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
  && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
  && apt-get update \
  && apt-get install -y google-chrome-unstable build-essential python git -y --no-install-recommends \
  && rm -rf /var/lib/apt/lists/*
# Install webserver dependencies
RUN npm i

# Bundle app source
COPY . .

# Create user for running sandboxed Chrome
RUN groupadd -r petrec && useradd -r -g petrec -G audio,video petrec \
  && mkdir -p /home/petrec/Downloads \
  && chown -R petrec:petrec /home/petrec /usr/src/app \
  && chown -R petrec:petrec ./node_modules

EXPOSE 8080
CMD ["npm", "start"]
