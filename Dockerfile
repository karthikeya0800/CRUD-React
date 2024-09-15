#Build the React app
FROM node:18

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm install

COPY . .

# Run the app
CMD ["sh","start.sh"]
