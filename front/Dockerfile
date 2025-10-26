FROM node:22-alpine as base
WORKDIR /app
COPY package*.json ./

ARG AWS_REGION
ARG AWS_BUCKET_NAME
ARG DATABASE_URL
ARG AI_API_URL

ENV AWS_REGION=$AWS_REGION
ENV AWS_BUCKET_NAME=$AWS_BUCKET_NAME
ENV DATABASE_URL=$DATABASE_URL
ENV AI_API_URL=$AI_API_URL

RUN npm install --legacy-peer-deps

FROM base as builder
WORKDIR /app
COPY . .
RUN npx prisma generate
RUN npm install @tailwindcss/postcss --legacy-peer-deps

RUN npm run build --legacy-peer-deps

FROM base as runner
WORKDIR /app
EXPOSE 3000


COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

CMD npm start