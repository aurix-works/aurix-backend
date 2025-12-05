# PM2 Process Management Guide

## Overview

PM2 is a production-grade process manager for Node.js applications. This project is configured with PM2 for:
- Zero-downtime deployments
- Automatic application restart
- Load balancing across CPU cores
- Process monitoring and management
- Log management
- Startup script generation

## Installation

PM2 is already installed globally. To verify:

```bash
pm2 --version
```

If you need to install it on another system:

```bash
npm install -g pm2
```

## Configuration

The project includes `ecosystem.config.js` with two app configurations:

### 1. Production/Staging Configuration (`aurix-backend`)
- Runs compiled JavaScript from `dist/` folder
- Cluster mode with maximum CPU utilization
- Optimized for production workloads
- Auto-restart on crashes
- Memory limit: 500MB per instance

### 2. Development Configuration (`aurix-backend-dev`)
- Runs TypeScript directly with ts-node
- Single instance in fork mode
- Watch mode enabled for auto-reload
- Optimized for development

## Quick Start

### Production Mode

1. **Build the application**:
   ```bash
   npm run build
   ```

2. **Start with PM2**:
   ```bash
   npm run pm2:start
   ```

3. **Check status**:
   ```bash
   npm run pm2:status
   ```

### Development Mode

```bash
npm run pm2:start:dev
```

This starts the app with watch mode, automatically restarting on file changes.

## NPM Scripts Reference

### Start/Stop Commands

```bash
# Start in production mode
npm run pm2:start

# Start in staging mode
npm run pm2:start:staging

# Start in development mode (with watch)
npm run pm2:start:dev

# Stop the application
npm run pm2:stop

# Delete from PM2 process list
npm run pm2:delete
```

### Restart Commands

```bash
# Restart (hard restart with downtime)
npm run pm2:restart

# Reload (zero-downtime restart)
npm run pm2:reload
```

**Note**: Use `reload` in production for zero-downtime deployments.

### Monitoring & Logs

```bash
# View real-time logs
npm run pm2:logs

# View process monitoring dashboard
npm run pm2:monit

# Check application status
npm run pm2:status

# Clear all logs
npm run pm2:flush
```

### Persistence

```bash
# Save current process list
npm run pm2:save

# Generate startup script (run once)
npm run pm2:startup
```

## PM2 Commands Explained

### Basic Commands

```bash
# Start application
pm2 start ecosystem.config.js --env production

# List all processes
pm2 list
pm2 status

# Stop specific app
pm2 stop aurix-backend

# Stop all apps
pm2 stop all

# Restart specific app
pm2 restart aurix-backend

# Reload (zero-downtime)
pm2 reload aurix-backend

# Delete from process list
pm2 delete aurix-backend
pm2 delete all
```

### Monitoring

```bash
# Real-time monitoring dashboard
pm2 monit

# View logs
pm2 logs                    # All apps
pm2 logs aurix-backend      # Specific app
pm2 logs --lines 100        # Last 100 lines

# View specific log files
pm2 logs aurix-backend --err     # Error logs only
pm2 logs aurix-backend --out     # Output logs only

# Flush all logs
pm2 flush

# Reload all logs
pm2 reloadLogs
```

### Process Information

```bash
# Detailed info about a process
pm2 show aurix-backend

# Show process description
pm2 describe aurix-backend

# Get environment variables
pm2 env 0
```

### Performance Monitoring

```bash
# CPU and Memory usage
pm2 status

# Real-time dashboard
pm2 monit

# Process metrics
pm2 show aurix-backend
```

## Cluster Mode vs Fork Mode

### Cluster Mode (Production)
```javascript
{
  instances: 'max',      // Use all CPU cores
  exec_mode: 'cluster'   // Enable load balancing
}
```

**Benefits**:
- Utilizes all CPU cores
- Built-in load balancing
- Zero-downtime reload
- Better performance for I/O operations

**Use for**: Production environments

### Fork Mode (Development)
```javascript
{
  instances: 1,
  exec_mode: 'fork'
}
```

**Benefits**:
- Simpler debugging
- Better for development
- Lower resource usage

**Use for**: Development environments

## Zero-Downtime Deployment

PM2's reload feature enables zero-downtime deployments:

```bash
# Build new version
npm run build

# Reload with zero downtime
npm run pm2:reload
```

**How it works**:
1. PM2 starts new instances with the updated code
2. New instances finish startup and are ready
3. PM2 gracefully shuts down old instances
4. Traffic seamlessly switches to new instances

## Environment Variables

Define different environments in `ecosystem.config.js`:

```javascript
env_production: {
  NODE_ENV: 'production',
  PORT: 3000,
},
env_staging: {
  NODE_ENV: 'staging',
  PORT: 3001,
},
env_development: {
  NODE_ENV: 'development',
  PORT: 3000,
}
```

Start with specific environment:

```bash
pm2 start ecosystem.config.js --env production
pm2 start ecosystem.config.js --env staging
pm2 start ecosystem.config.js --env development
```

## Log Management

### Log Files Location

```
logs/
├── pm2-error.log       # Production error logs
├── pm2-out.log         # Production output logs
├── pm2-dev-error.log   # Development error logs
└── pm2-dev-out.log     # Development output logs
```

### Log Rotation

Install PM2 log rotation module:

```bash
pm2 install pm2-logrotate
```

Configure rotation:

```bash
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 30
pm2 set pm2-logrotate:compress true
```

## Startup Script (Auto-start on Reboot)

Generate startup script to auto-start PM2 on system reboot:

```bash
# Generate startup script
npm run pm2:startup

# Save current process list
npm run pm2:save
```

This ensures your application automatically starts when the server reboots.

### Disable Startup

```bash
pm2 unstartup
```

## Memory Management

The configuration sets a memory limit:

```javascript
max_memory_restart: '500M'
```

PM2 automatically restarts the app if it exceeds 500MB memory usage, preventing memory leaks from crashing your server.

Adjust this based on your needs in `ecosystem.config.js`.

## Deployment with PM2

### Setup Deployment

1. **Configure deployment** in `ecosystem.config.js`:

```javascript
deploy: {
  production: {
    user: 'node',
    host: 'production-server.com',
    ref: 'origin/main',
    repo: 'git@github.com:username/aurix-backend.git',
    path: '/var/www/aurix-backend',
    'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production'
  }
}
```

2. **Setup remote server** (first time only):

```bash
pm2 deploy ecosystem.config.js production setup
```

3. **Deploy**:

```bash
npm run deploy:production
```

### Deployment Commands

```bash
# Deploy to production
npm run deploy:production

# Deploy to staging
npm run deploy:staging

# Deploy specific ref
pm2 deploy ecosystem.config.js production exec "pm2 reload all"

# Revert to previous deployment
pm2 deploy ecosystem.config.js production revert 1
```

## Advanced Configuration

### Watch Mode

Enable watch mode for auto-reload on file changes:

```javascript
watch: true,
ignore_watch: ['node_modules', 'logs', 'dist', '.git'],
watch_options: {
  followSymlinks: false,
  usePolling: false
}
```

**Note**: Only enabled in development configuration by default.

### Graceful Shutdown

```javascript
kill_timeout: 5000,        // Time before force kill
wait_ready: true,          // Wait for app ready signal
listen_timeout: 10000      // Max time to wait for listen
```

Implement graceful shutdown in your app:

```javascript
process.on('SIGINT', async () => {
  console.log('Graceful shutdown initiated');

  // Close database connections
  await database.close();

  // Close server
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});
```

### Max Restarts

```javascript
max_restarts: 10,
min_uptime: '10s'
```

PM2 stops auto-restarting if app crashes more than 10 times within 10 seconds.

## Monitoring & Alerts

### PM2 Plus (Optional)

For advanced monitoring, use PM2 Plus:

```bash
pm2 link <secret_key> <public_key>
```

Features:
- Real-time monitoring dashboard
- Email/Slack alerts
- Exception reporting
- Custom metrics
- Transaction tracing

Visit: https://app.pm2.io

### Custom Metrics

Add custom metrics to your application:

```javascript
const pmx = require('pmx').init({
  http: true,
  errors: true,
  custom_probes: true
});

const probe = pmx.probe();

// Counter metric
const counter = probe.counter({
  name: 'API Calls',
  agg_type: 'sum'
});

// Meter metric
const meter = probe.meter({
  name: 'Requests/min',
  samples: 60,
  timeframe: 60
});

// Use in your code
counter.inc();
meter.mark();
```

## Troubleshooting

### App Won't Start

```bash
# Check error logs
npm run pm2:logs

# View detailed information
pm2 describe aurix-backend

# Delete and restart
npm run pm2:delete
npm run build
npm run pm2:start
```

### High Memory Usage

```bash
# Check memory usage
pm2 status

# Reduce instances
pm2 scale aurix-backend 2  # Scale to 2 instances

# Or modify ecosystem.config.js
instances: 2  # Instead of 'max'
```

### App Keeps Restarting

```bash
# Check logs for errors
npm run pm2:logs

# Check restart count
pm2 status

# View full process info
pm2 show aurix-backend
```

### Can't Access Logs

```bash
# Check log file permissions
ls -la logs/

# Clear and recreate logs
npm run pm2:flush
npm run pm2:restart
```

## Performance Tips

1. **Use Cluster Mode**: Utilize all CPU cores in production
2. **Set Memory Limits**: Prevent memory leaks from crashing the server
3. **Enable Log Rotation**: Prevent disk space issues
4. **Use Reload, Not Restart**: Zero-downtime deployments
5. **Monitor Metrics**: Use PM2 Plus or custom monitoring
6. **Graceful Shutdown**: Implement proper cleanup on shutdown
7. **Set Min Uptime**: Prevent restart loops from bad deploys

## Best Practices

### Development
- Use fork mode with watch enabled
- Single instance for easier debugging
- Lower memory limits

### Staging
- Mirror production configuration
- Test deployments here first
- Use separate environment variables

### Production
- Use cluster mode with `instances: 'max'`
- Enable memory limits
- Implement graceful shutdown
- Setup log rotation
- Configure startup script
- Use PM2 reload for deployments
- Monitor with PM2 Plus or similar

## Cheat Sheet

```bash
# Start/Stop
pm2 start ecosystem.config.js
pm2 stop aurix-backend
pm2 restart aurix-backend
pm2 reload aurix-backend
pm2 delete aurix-backend

# Monitor
pm2 status
pm2 logs
pm2 monit
pm2 show aurix-backend

# Manage
pm2 save
pm2 resurrect
pm2 unstartup
pm2 startup

# Update PM2
pm2 update
npm install -g pm2@latest
```

## Additional Resources

- [PM2 Official Documentation](https://pm2.keymetrics.io/docs/)
- [PM2 Cluster Mode](https://pm2.keymetrics.io/docs/usage/cluster-mode/)
- [PM2 Deployment](https://pm2.keymetrics.io/docs/usage/deployment/)
- [PM2 Plus Monitoring](https://pm2.io/)
