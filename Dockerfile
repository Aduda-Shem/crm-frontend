FROM node:20-alpine
WORKDIR /app

# copy only package.json + lock file for caching
COPY package*.json ./
RUN npm install --silent || true

# copy all source code
COPY . .

EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host"]
