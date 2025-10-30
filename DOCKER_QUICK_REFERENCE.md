# Docker Quick Reference

## 🚀 Quick Start Commands

### Start the application

```bash
docker-compose up -d
```

### Start in development mode (with hot reload)

```bash
docker-compose --profile dev up -d app-dev
```

### Stop the application

```bash
docker-compose down
```

### View logs

```bash
# All services
docker-compose logs -f

# Only app
docker-compose logs -f app

# Only MongoDB
docker-compose logs -f mongodb
```

## 🔧 Build Commands

### Build/Rebuild the Docker image

```bash
docker-compose build

# Force rebuild without cache
docker-compose build --no-cache
```

### Rebuild and restart

```bash
docker-compose up -d --build
```

## 📊 Monitoring Commands

### Check running containers

```bash
docker-compose ps
```

### Check resource usage

```bash
docker stats
```

### View service health

```bash
docker inspect rbac-app | grep -A 10 Health
```

## 🛠️ Maintenance Commands

### Restart a specific service

```bash
docker-compose restart app
docker-compose restart mongodb
```

### Stop and remove all containers, networks

```bash
docker-compose down
```

### Stop and remove containers, networks, and volumes (⚠️ deletes DB data)

```bash
docker-compose down -v
```

### Remove everything including images

```bash
docker-compose down -v --rmi all
```

## 🐛 Debugging Commands

### Execute commands inside app container

```bash
docker-compose exec app sh
```

### Execute commands inside MongoDB container

```bash
docker-compose exec mongodb sh

# Or directly access MongoDB shell
docker-compose exec mongodb mongosh -u admin -p admin123
```

### Check MongoDB connection from app container

```bash
docker-compose exec app node -e "console.log(process.env.MONGO_URI)"
```

### View environment variables

```bash
docker-compose exec app env
```

## 🧹 Cleanup Commands

### Remove stopped containers

```bash
docker container prune
```

### Remove unused images

```bash
docker image prune
```

### Remove unused volumes

```bash
docker volume prune
```

### Remove all unused data (containers, networks, images, volumes)

```bash
docker system prune -a --volumes
```

## 📦 Database Operations

### Backup MongoDB data

```bash
docker-compose exec mongodb mongodump --uri="mongodb://admin:admin123@localhost:27017/rbac_db?authSource=admin" --out=/data/backup
```

### Restore MongoDB data

```bash
docker-compose exec mongodb mongorestore --uri="mongodb://admin:admin123@localhost:27017/rbac_db?authSource=admin" /data/backup/rbac_db
```

### Access MongoDB shell

```bash
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### List databases

```bash
docker-compose exec mongodb mongosh -u admin -p admin123 --authenticationDatabase admin --eval "show dbs"
```

## 🔍 Troubleshooting

### Port already in use

Update `.env` file:

```env
APP_PORT=5001
MONGO_PORT=27018
```

### Check if containers are healthy

```bash
docker-compose ps
```

### View detailed logs with timestamps

```bash
docker-compose logs -f --timestamps
```

### Restart everything from scratch

```bash
docker-compose down -v
docker-compose build --no-cache
docker-compose up -d
```

## 📝 NPM Scripts (from package.json)

```bash
npm run docker:build   # Build Docker image
npm run docker:up      # Start services
npm run docker:down    # Stop services
npm run docker:logs    # View logs
npm run docker:dev     # Start in dev mode
```

## 🌐 Access Points

- **Application**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/auth/health
- **MongoDB**: mongodb://localhost:27017

## 🔐 Default Credentials

**MongoDB:**

- Username: `admin`
- Password: `admin123`
- Database: `rbac_db`

⚠️ **Change these in `.env` for production!**

## 📚 Additional Resources

- [Docker Documentation](https://docs.docker.com/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [MongoDB Docker Documentation](https://hub.docker.com/_/mongo)
- [Node.js Docker Best Practices](https://github.com/nodejs/docker-node/blob/main/docs/BestPractices.md)
