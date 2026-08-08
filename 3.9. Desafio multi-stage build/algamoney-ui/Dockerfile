##STAGE BUILD
FROM node:18-alpine as build
ARG ENV=dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -f && npm install -f -g @angular/cli@14.0.1
COPY . .
RUN npm run build:$ENV

## STAGE RUN
FROM nginx:latest
COPY --from=build /app/dist/algamoney-ui/ /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
