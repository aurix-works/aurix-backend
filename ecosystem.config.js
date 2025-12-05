module.exports = {
  apps: [
    {
      name: 'aurix-backend',
      script: './dist/server.js',
      instances: 'max',
      exec_mode: 'cluster',

      // Environment variables
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
      },

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      merge_logs: true,
      log_type: 'json',

      // Advanced features
      watch: false,
      ignore_watch: ['node_modules', 'logs', 'dist', '.git'],
      watch_options: {
        followSymlinks: false,
      },

      // Restart configuration
      max_memory_restart: '500M',
      min_uptime: '10s',
      max_restarts: 10,
      autorestart: true,

      // Graceful shutdown
      kill_timeout: 5000,
      wait_ready: true,
      listen_timeout: 10000,

      // Instance management
      instance_var: 'INSTANCE_ID',

      // Source map support
      source_map_support: true,

      // Time before forcing a reload
      shutdown_with_message: false,
    },

    // Development mode configuration
    {
      name: 'aurix-backend-dev',
      script: 'ts-node',
      args: 'src/server.ts',
      instances: 1,
      exec_mode: 'fork',

      env: {
        NODE_ENV: 'development',
        PORT: 3000,
        TS_NODE_PROJECT: './tsconfig.json',
      },

      // Watch mode for development
      watch: ['src'],
      ignore_watch: ['node_modules', 'logs', 'dist', '.git'],
      watch_options: {
        followSymlinks: false,
        usePolling: false,
      },

      // Logging
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/pm2-dev-error.log',
      out_file: './logs/pm2-dev-out.log',
      merge_logs: true,

      // Development specific
      autorestart: true,
      max_restarts: 5,
      min_uptime: '5s',
    },
  ],

  deploy: {
    production: {
      user: 'node',
      host: ['production-server.com'],
      ref: 'origin/main',
      repo: 'git@github.com:username/aurix-backend.git',
      path: '/var/www/aurix-backend',
      'pre-deploy-local': '',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env production',
      'pre-setup': '',
      ssh_options: 'StrictHostKeyChecking=no',
    },

    staging: {
      user: 'node',
      host: ['staging-server.com'],
      ref: 'origin/develop',
      repo: 'git@github.com:username/aurix-backend.git',
      path: '/var/www/aurix-backend-staging',
      'post-deploy': 'npm install && npm run build && pm2 reload ecosystem.config.js --env staging',
      ssh_options: 'StrictHostKeyChecking=no',
    },
  },
};
