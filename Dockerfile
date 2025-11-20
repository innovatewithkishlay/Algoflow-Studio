FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

COPY frontend.env .env

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--port", "3000", "--host"]
