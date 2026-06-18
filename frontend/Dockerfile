FROM node:20-alpine AS base
WORKDIR /usr/src/app 
COPY package*.json ./

FROM base AS development
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5173
CMD ["npm" ,"run", "dev", "--", "--host"]

FROM base AS build
RUN npm install --legacy-peer-deps
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS production
COPY --from=build /usr/src/app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]