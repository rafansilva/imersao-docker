FROM node:18-alpine
ARG ENV=dev
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install -f && npm install -f -g @angular/cli@14.0.1
COPY . .
RUN npm run build:$ENV
EXPOSE 80
RUN apk update && \
    apk add --no-cache nginx && \
    mkdir -p /run/nginx /usr/share/nginx/html/ && \
    cp -r /app/dist/algamoney-ui/* /usr/share/nginx/html && \
    rm -rf /var/cache/apk/*

COPY ./nginx.conf /etc/nginx/nginx.conf

# Comando padrão para iniciar o Nginx
CMD ["nginx", "-g", "daemon off;"]
