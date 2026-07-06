/**
 * InfoOly Track - PM2 进程管理配置
 * 使用方式：pm2 start deploy/pm2.config.js
 * 保存进程列表：pm2 save
 * 设置开机自启：pm2 startup
 */
module.exports = {
  apps: [
    {
      name: 'info-oly-track',
      // 使用 node 直接运行 next start，避免 spawn npm 的问题
      script: './node_modules/.bin/next',
      args: 'start',
      interpreter: '/usr/bin/node',
      // 部署目录，请根据实际路径修改
      cwd: '/var/www/info-oly-track',

      // SQLite 为文件级锁，不支持多进程并发写入，因此只能单实例
      instances: 1,
      exec_mode: 'fork',

      // 内存限制与自动重启
      max_memory_restart: '512M',
      restart_delay: 3000,
      max_restarts: 5,
      min_uptime: '10s',

      // 环境变量
      env: {
        NODE_ENV: 'production',
        NEXT_TELEMETRY_DISABLED: '1',
      },

      // 日志配置
      log_file: '/var/log/info-oly-track/combined.log',
      out_file: '/var/log/info-oly-track/out.log',
      error_file: '/var/log/info-oly-track/error.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true,

      // 不启用文件监听（生产环境手动重启）
      watch: false,

      // 优雅关闭
      kill_timeout: 5000,
      listen_timeout: 10000,

      // 崩溃时自动重启
      autorestart: true,
    },
  ],
};
