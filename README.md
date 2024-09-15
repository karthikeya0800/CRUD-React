**Docker hub link**: <br>
https://hub.docker.com/repository/docker/karthikeya2100/crud-react

**Endpoints:**

- /api/items is to get all items
- /api/add-item is to add item
- /api/update-item/:id is to update item
- /api/delete-item/:id is to delete item

_Default server port is 3000_

_Default client port is 5173_

**Environment variables:**

- API_URL = http://localhost:3000
- BACKEND_FRAMEWORK = Express.js

**Sample docker-compose.yml file:**<br>

```
version: '3'
services:
  frontend:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: crud-react
    environment:
      - API_URL=http://localhost:9000
      - BACKEND_FRAMEWORK=Express.js
    ports:
      - '5173:5173'
    volumes:
      - ./frontend:/app/dist
```
