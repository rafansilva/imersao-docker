FROM node:18-alpine
ARG ENV=dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -f && npm install -f -g http-server @angular/cli@14.0.1
COPY . .
RUN npm run build:$ENV
EXPOSE 8080
CMD http-server -p 8080 -a 0.0.0.0 dist/algamoney-ui --proxy http://localhost:8080
