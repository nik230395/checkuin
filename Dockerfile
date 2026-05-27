# Stage 1: build the Angular app
FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY . .
# Default (development) configuration uses environment.ts → apiUrl http://localhost:8080/api
RUN npx ng build --configuration=development

# Stage 2: serve with nginx
FROM nginx:alpine
RUN rm -rf /usr/share/nginx/html/*
# Angular 21 application builder outputs to dist/<project>/browser
COPY --from=build /app/dist/frontend_Checkuin/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
