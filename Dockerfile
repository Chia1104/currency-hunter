ARG NODE_VERSION=24

FROM node:${NODE_VERSION}-alpine AS base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /app

RUN apk update && \
    apk add --no-cache \
    libc6-compat && \
    npm install -g corepack@latest && \
    corepack enable pnpm

FROM base AS builder

COPY . .

RUN pnpm i

RUN pnpm build

FROM base AS runner

COPY --from=builder /app/.output ./.output

ENV NODE_ENV=production \
    PORT=8080

WORKDIR /app

EXPOSE 8080

CMD [ "node", ".output/server/index.mjs" ]