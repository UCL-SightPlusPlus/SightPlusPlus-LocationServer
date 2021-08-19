FROM node:14-alpine
# ENV NODE_ENV=production
# WORKDIR /usr/src/app
WORKDIR /app
COPY package.json .
RUN npm install
COPY . ./
EXPOSE 8080
EXPOSE 7979
CMD ["node", "server.js", "--trace-uncaught"]
