FROM mhart/alpine-node

# Cd into /app
WORKDIR /app

# Copy package.json into app folder
COPY . /app

# Install dependencies
RUN npm install

# Start server on port 3000
EXPOSE 8080

CMD node server.js