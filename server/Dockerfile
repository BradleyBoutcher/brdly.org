# Run environment
FROM node:12.2.0-alpine

# Create app directory
WORKDIR /usr/src/app

RUN apk add --no-cache openssl

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN openssl req -new -newkey rsa:4096 -days 365 -nodes -x509 \
    -passout pass:${SSL_PASSPHRASE} \
    -subj "/C=US/ST=Denial/L=Springfield/O=Dis/CN=localhost" \
    -keyout key.pem  -out cert.pem

RUN npm ci --only=production

# Bundle app source
COPY . .

CMD [ "npm", "run-script", "start:prod" ]