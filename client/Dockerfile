FROM node:14-alpine as build

WORKDIR /srv/app
COPY package.json package-lock.json ./
RUN npm install --quiet
COPY .env .
COPY tsconfig.json .
COPY @types @types
COPY config config
COPY public public
COPY src src
COPY index.html index.html
RUN npm run build

FROM nginx:latest
COPY misc/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /srv/app/build /usr/share/nginx/html
EXPOSE 80
