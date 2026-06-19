FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./

FROM base AS development
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5001
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm ci --only=production
COPY . .
EXPOSE 5001
CMD ["node", "src/index.js"]