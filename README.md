**Docker hub link**: <br>
https://hub.docker.com/repository/docker/karthikeya2100/crud-react

**Endpoints:**

- /api/items is to get all items
- /api/add-item is to add item
- /api/update-item/:id is to update item
- /api/delete-item/:id is to delete item

*Default server port is 3000*

*Default client port is 5173*

**Environment variables:**

- PORT = 5001 //Backend server port
- API_URL = http://localhost:3000
- BACKEND_FRAMEWORK = Express.js

**Sample docker-compose.yml file:**<br>

```
version: '3.8'

services:
    frontend:
    image: karthikeya2100/crud-react:latest
    container_name: crud-react
    environment:
      - API_URL=http://localhost:3000
      - PORT=5001
      - BACKEND_FRAMEWORK=Express.js
    ports:
      - '5000:5001'
    depends_on:
      - backend
```
