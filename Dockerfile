FROM node:lts-alpine

WORKDIR /srv/app
ADD . /srv/app
RUN corepack enable \
    && corepack prepare pnpm@latest --activate
