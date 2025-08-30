FROM node:20-alpine
WORKDIR /app
COPY frontend/package.json ./
RUN npm install --silent || true
COPY frontend/ /app
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
