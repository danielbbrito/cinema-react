FROM node:20-alpine

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

EXPOSE 3000 5173

CMD ["sh", "-c", "npx json-server --watch data/db.json --port 3000 & npm run dev -- --host"]