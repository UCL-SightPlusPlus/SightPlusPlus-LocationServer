FROM node:14-alpine
# ENV NODE_ENV=production
# WORKDIR /usr/src/app
RUN npm install -g openssl
RUN openssl req -nodes -new -x509 -keyout server.key -out server.cert \
    -subj "/C=UK/ST=London/L=London/O=Sight++/OU=LocationServer/CN=localhost"
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 8080
EXPOSE 7979
CMD ["node", "server.js", "--trace-uncaught"]
