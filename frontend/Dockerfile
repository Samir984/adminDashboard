FROM node:22.11.0-alpine
# RUN addgroup app && adduser -S -G app app 
# USER app
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
ENV env="this is env varible"
EXPOSE 5173

# Shell form
# separate shell is create and this command is execute
# CMD npm start

# Exec form
# this can be overwrite easily: docker run react-app npm start
CMD ["npm", "run", "dev"]

