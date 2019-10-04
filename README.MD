# Brdly.org
A fast & secure URL shortening service.

## Structure

### Client
Our front-end is running a standard react application that manages communication with the server and state management.
    - Our Dockerfile for the client generates a new build, and runs it within a Nginx reverse-proxy container

### Server
Our back-end is a secured Express.js application, handling the model, routes, and controller for communication with our database.
    - For development, we use Nodemon for quick rebuilds upon file changes

### Database
We're running a simple postgres database with minimal required tables to store a large amount of URLs

### Orchestration
Each component runs in a Docker container, allowing for customization and communications between containers to be determined at runtime.

### Additional details
- A single shortened URL is limited to 50 uses
- A single shortened URL will expire after a set period of days

## Running & Developing Locally

### Simulate Production
1. From the repository directory, run:
```docker-compose up -d --build```

### Development
1. From the 'Database' directory, run:
```docker build && docker run -p 5432:5432```
2. From the 'Client' directory, run:
```yarn start```
3. From the 'Server' directory, run 
```npm start```

## Feedback
Feel free to contact me directly or submit an issue! 

## Planned features
- Lock API behind host
- Validate URL existence outside of domain
- Offer a selection of expiration time lengths (1 hr, 1 day, etc.)

