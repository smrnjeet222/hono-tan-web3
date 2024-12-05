# Adjust NODE_VERSION as desired
ARG NODE_VERSION=20
FROM node:${NODE_VERSION}-alpine AS base

# Throw-away build stage to reduce size of final image
FROM base AS builder

RUN apk add --no-cache --virtual .build-deps \
  build-base pkgconfig python3
# Node app lives here
WORKDIR /app

COPY --link . . 

RUN npm install -g pnpm

# Install node modules for backend
RUN pnpm install --frozen-lockfile --prod
# Build the backend app
RUN pnpm run build


# Install frontend node modules
# Change to frontend directory and build the frontend app
WORKDIR /app/frontend
RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --prod

FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 hono

COPY --from=builder --chown=hono:nodejs /app/node_modules /app/node_modules
COPY --from=builder --chown=hono:nodejs /app/dist /app/dist
COPY --from=builder --chown=hono:nodejs /app/package.json /app/package.json

COPY --from=builder --chown=hono:nodejs /app/frontend/node_modules /app/frontend/node_modules
COPY --from=builder --chown=hono:nodejs /app/frontend/dist /app/frontend/dist
COPY --from=builder --chown=hono:nodejs /app/frontend/package.json /app/frontend/package.json

USER hono
EXPOSE 3000

CMD [ "node", "/app/dist/index.cjs" ]

