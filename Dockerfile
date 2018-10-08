FROM node:8
WORKDIR /app
COPY package*.json /app/
RUN npm install
RUN npm install -g typescript
COPY . /app/
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]
