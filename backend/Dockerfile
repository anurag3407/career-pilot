FROM node:20-alpine AS base
WORKDIR /usr/src/app
COPY package*.json ./
# python3 is required by the activity analyzer (backend/activity/analyzer.py)
RUN apk add --no-cache python3 py3-pip git build-base pkgconf
COPY requirements.txt ./

FROM base AS development
RUN npm install --legacy-peer-deps \
 && pip install --no-cache-dir --break-system-packages -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["npm", "run", "dev"]

FROM base AS production
RUN npm install --legacy-peer-deps --omit=dev \
 && pip install --no-cache-dir --break-system-packages -r requirements.txt
COPY . .
EXPOSE 5001
CMD ["node", "src/index.js"]