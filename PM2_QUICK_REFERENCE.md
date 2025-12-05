# PM2 Quick Reference

## Essential Commands

### Start/Stop
```bash
npm run pm2:start           # Start in production
npm run pm2:start:staging   # Start in staging
npm run pm2:start:dev       # Start in development (watch mode)
npm run pm2:stop            # Stop application
npm run pm2:delete          # Remove from PM2
```

### Restart/Reload
```bash
npm run pm2:restart         # Restart (with downtime)
npm run pm2:reload          # Zero-downtime reload ⭐
```

### Monitoring
```bash
npm run pm2:logs            # View logs (Ctrl+C to exit)
npm run pm2:status          # Check status
npm run pm2:monit           # Real-time monitoring
```

### Persistence
```bash
npm run pm2:save            # Save process list
npm run pm2:startup         # Generate startup script
```

### Logs
```bash
npm run pm2:flush           # Clear all logs
pm2 logs --lines 100        # View last 100 lines
pm2 logs --err              # View errors only
```

## Common Workflows

### First Time Production Deployment
```bash
npm run build
npm run pm2:start
npm run pm2:save
npm run pm2:startup
# Follow PM2 instructions
```

### Update Deployment (Zero Downtime)
```bash
git pull
npm install
npm run build
npm run pm2:reload
```

### Check Application Health
```bash
npm run pm2:status
npm run pm2:logs
```

### View Resource Usage
```bash
npm run pm2:monit
```

## Direct PM2 Commands

```bash
pm2 start ecosystem.config.js           # Start from config
pm2 list                                 # List all processes
pm2 show aurix-backend                   # Detailed info
pm2 restart aurix-backend               # Restart app
pm2 reload aurix-backend                # Zero-downtime reload
pm2 stop aurix-backend                  # Stop app
pm2 delete aurix-backend                # Remove app
pm2 logs aurix-backend                  # View logs
pm2 flush                               # Clear logs
pm2 monit                               # Monitoring dashboard
pm2 save                                # Save process list
pm2 resurrect                           # Restore saved processes
pm2 update                              # Update PM2 itself
```

## Troubleshooting

### App Won't Start
```bash
npm run pm2:logs            # Check error logs
npm run pm2:delete          # Remove from PM2
npm run build               # Rebuild
npm run pm2:start           # Start again
```

### High Memory
```bash
npm run pm2:status          # Check memory usage
npm run pm2:restart         # Restart to free memory
```

### Check Crash Logs
```bash
pm2 logs --err --lines 50   # Last 50 error lines
```

## Configuration Files

- **ecosystem.config.js** - PM2 configuration
- **logs/pm2-error.log** - Production errors
- **logs/pm2-out.log** - Production output
- **logs/pm2-dev-error.log** - Development errors
- **logs/pm2-dev-out.log** - Development output

## Tips

✅ Use `reload` instead of `restart` for zero downtime
✅ Always run `pm2 save` after starting apps
✅ Setup startup script for auto-restart on reboot
✅ Monitor logs regularly with `pm2 logs`
✅ Use cluster mode in production (already configured)
✅ Check status before and after deployments

## Links

- [Full PM2 Guide](./PM2_GUIDE.md)
- [Official PM2 Docs](https://pm2.keymetrics.io/)
