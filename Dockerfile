
FROM node:18-alpine

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . .

# Set the entrypoint script as executable
# RUN chmod +x /app/entrypoint.sh

EXPOSE 5173

CMD npm run dev
# CMD npm run start:migrate:dev

