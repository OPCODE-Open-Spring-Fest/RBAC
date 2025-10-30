# Docker Deployment Guide

This guide explains how to run the RBAC application using Docker and Docker Compose.

## Prerequisites

- Docker Engine 20.10+ installed
- Docker Compose v2.0+ installed

## Quick Start

### 1. Clone the repository and navigate to the project directory

```bash
cd /path/to/RBAC
```

### 2. Create environment file

Copy the example environment file and update with your values:

```bash
cp .env.example .env
```

**Important:** Update the `JWT_SECRET` and database credentials in `.env` for production!

### 3. Run with Docker Compose

> **Note:** Use `docker compose` (v2) instead of `docker-compose` (v1) if you have Docker Compose v2 installed.

#### Production Mode

Start the application in production mode:

```bash
# Docker Compose v2 (recommended)
docker compose up -d

# Or Docker Compose v1
docker-compose up -d
```

This will start:

- MongoDB database on port 27017
- Node.js application on port 5000

#### Development Mode

Start the application in development mode with hot reload:

```bash
# Docker Compose v2 (recommended)
docker compose --profile dev up -d app-dev

# Or Docker Compose v1
docker-compose --profile dev up -d app-dev
```

This enables nodemon for automatic restart on code changes.

### 4. Check the logs

```bash
# View all logs (v2)
docker compose logs -f

# Or with v1
docker-compose logs -f

# View app logs only
docker compose logs -f app

# View MongoDB logs only
docker compose logs -f mongodb
```

### 5. Stop the services

```bash
# Docker Compose v2
docker compose down

# Or Docker Compose v1
docker-compose down
```

To remove volumes as well (⚠️ this will delete all database data):

```bash
docker compose down -v
```

## Using Docker Without Compose

### Build the Docker image

```bash
docker build -t rbac-app:latest .
```

### Run MongoDB container

```bash
docker run -d \
  --name rbac-mongodb \
  -p 27017:27017 \
  -e MONGO_INITDB_ROOT_USERNAME=admin \
  -e MONGO_INITDB_ROOT_PASSWORD=admin123 \
  -e MONGO_INITDB_DATABASE=rbac_db \
  -v mongodb_data:/data/db \
  mongo:7-jammy
```

### Run the application container

```bash
docker run -d \
  --name rbac-app \
  -p 5000:5000 \
  -e MONGO_URI="mongodb://admin:admin123@rbac-mongodb:27017/rbac_db?authSource=admin" \
  -e JWT_SECRET="your_jwt_secret" \
  -e PORT=5000 \
  --link rbac-mongodb:mongodb \
  rbac-app:latest
```

## Environment Variables

| Variable              | Description               | Default                 |
| --------------------- | ------------------------- | ----------------------- |
| `NODE_ENV`            | Application environment   | `production`            |
| `PORT`                | Application port          | `5000`                  |
| `MONGO_URI`           | MongoDB connection string | See `.env.example`      |
| `MONGO_ROOT_USERNAME` | MongoDB root username     | `admin`                 |
| `MONGO_ROOT_PASSWORD` | MongoDB root password     | `admin123`              |
| `MONGO_DB_NAME`       | MongoDB database name     | `rbac_db`               |
| `JWT_SECRET`          | Secret key for JWT tokens | Required                |
| `JWT_EXPIRE`          | JWT token expiration      | `7d`                    |
| `CORS_URL`            | Allowed CORS origin       | `http://localhost:3000` |

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use strong passwords** - Change default MongoDB credentials
3. **Generate a strong JWT_SECRET** - Use a cryptographically secure random string
4. **Run as non-root user** - The Dockerfile already configures this
5. **Keep images updated** - Regularly update base images for security patches

## Health Checks

The application includes health checks:

- **MongoDB**: Checks if database is responsive
- **App**: Checks if the application is running (requires implementing `/api/auth/health` endpoint)

## Troubleshooting

### Application can't connect to MongoDB

1. Check if MongoDB container is running:

   ```bash
   docker-compose ps
   ```

2. Verify MongoDB health:

   ```bash
   docker-compose logs mongodb
   ```

3. Ensure MONGO_URI in `.env` is correct

### Permission denied errors

If you see permission errors, ensure the non-root user has proper permissions:

```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Port already in use

If port 5000 or 27017 is already in use, update the ports in `.env`:

```env
APP_PORT=5001
MONGO_PORT=27018
```

## Production Deployment

For production deployment:

1. Use a production-grade MongoDB setup (MongoDB Atlas or managed service)
2. Set strong, unique passwords
3. Enable SSL/TLS for MongoDB connections
4. Use secrets management (Docker Secrets, Kubernetes Secrets, etc.)
5. Set up proper monitoring and logging
6. Configure resource limits in docker-compose.yml:

```yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

## Useful Commands

```bash
# Rebuild and restart
docker-compose up -d --build

# View running containers
docker-compose ps

# Execute commands in app container
docker-compose exec app sh

# Access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123

# Remove all containers, volumes, and images
docker-compose down -v --rmi all

# View resource usage
docker stats
```

## Support

For issues or questions, please open an issue on the GitHub repository.
