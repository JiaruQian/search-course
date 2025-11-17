# 部署指南 🚀

本文档提供项目的详细部署步骤和配置说明。

## 📋 部署前准备

### 环境要求

**服务器环境**:
- Node.js >= 14.x
- npm >= 6.x 或 yarn >= 1.22
- Nginx >= 1.18（推荐）或其他 Web 服务器
- 至少 1GB 内存
- 至少 10GB 磁盘空间

**后端服务**:
- 后端 API 服务已部署并可访问
- 数据库服务正常运行

### 获取代码

```bash
# 克隆仓库
git clone <repository-url>
cd search-course

# 安装依赖
npm install
```

---

## 🔧 配置步骤

### 1. 环境变量配置

创建 `.env.production` 文件：

```bash
# 生产环境配置
VUE_APP_API_BASE_URL=https://your-api-domain.com
```

### 2. Vue 配置调整

修改 `vue.config.js`（如需要）：

```javascript
module.exports = defineConfig({
  // 如果部署在子目录，修改此项
  // 例如：部署在 https://example.com/app/
  publicPath: process.env.NODE_ENV === 'production'
    ? '/app/'  // 根据实际情况修改
    : '/',
    
  // 生产环境构建优化
  productionSourceMap: false,  // 不生成 source map
  
  devServer: {
    // 开发环境配置保持不变
  }
});
```

---

## 📦 构建项目

### 构建命令

```bash
# 生产环境构建
npm run build

# 构建完成后，产物在 dist/ 目录
```

### 构建产物

```
dist/
├── css/                # CSS 文件
├── js/                 # JavaScript 文件
├── img/                # 图片资源
├── favicon.ico         # 网站图标
└── index.html          # 入口 HTML
```

---

## 🌐 服务器部署

### 方案一：Nginx 部署（推荐）

#### 1. 上传文件

```bash
# 将 dist 目录上传到服务器
scp -r dist/* user@server:/var/www/search-course/
```

#### 2. Nginx 配置

创建配置文件 `/etc/nginx/sites-available/search-course`：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # 根目录
    root /var/www/search-course;
    index index.html;
    
    # Gzip 压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;
    gzip_comp_level 6;
    gzip_min_length 1000;
    
    # 静态资源缓存
    location ~* \.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # SPA 路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API 代理（可选，如果后端和前端在同一域名下）
    location /api/ {
        proxy_pass http://localhost:8082/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
    
    # 安全头部
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
}
```

#### 3. 启用配置

```bash
# 创建符号链接
sudo ln -s /etc/nginx/sites-available/search-course /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重启 Nginx
sudo systemctl restart nginx
```

#### 4. HTTPS 配置（使用 Let's Encrypt）

```bash
# 安装 Certbot
sudo apt install certbot python3-certbot-nginx

# 获取证书
sudo certbot --nginx -d your-domain.com

# 自动续期
sudo certbot renew --dry-run
```

---

### 方案二：Apache 部署

#### 1. 上传文件

```bash
scp -r dist/* user@server:/var/www/search-course/
```

#### 2. Apache 配置

创建配置文件 `/etc/apache2/sites-available/search-course.conf`：

```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/search-course
    
    <Directory /var/www/search-course>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
        
        # SPA 路由支持
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # 静态资源缓存
    <FilesMatch "\.(jpg|jpeg|png|gif|ico|css|js|woff|woff2|ttf)$">
        Header set Cache-Control "max-age=31536000, public"
    </FilesMatch>
    
    # 压缩
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
    </IfModule>
</VirtualHost>
```

#### 3. 启用配置

```bash
# 启用必要的模块
sudo a2enmod rewrite
sudo a2enmod headers
sudo a2enmod deflate

# 启用站点
sudo a2ensite search-course

# 重启 Apache
sudo systemctl restart apache2
```

---

### 方案三：Docker 部署

#### 1. 创建 Dockerfile

```dockerfile
# 构建阶段
FROM node:14-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# 生产阶段
FROM nginx:alpine as production-stage
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### 2. 创建 nginx.conf

```nginx
server {
    listen 80;
    server_name localhost;
    
    root /usr/share/nginx/html;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

#### 3. 创建 docker-compose.yml

```yaml
version: '3.8'

services:
  frontend:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### 4. 构建并运行

```bash
# 构建镜像
docker-compose build

# 启动容器
docker-compose up -d

# 查看日志
docker-compose logs -f
```

---

## 🔒 安全配置

### 1. 防火墙配置

```bash
# UFW (Ubuntu)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 2. 限制访问频率

在 Nginx 中添加速率限制：

```nginx
http {
    limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
    
    server {
        location /api/ {
            limit_req zone=api burst=20;
            proxy_pass http://backend;
        }
    }
}
```

### 3. CORS 配置

如果前后端分离部署，确保后端正确配置 CORS：

```javascript
// 后端示例（Node.js/Express）
app.use(cors({
  origin: 'https://your-frontend-domain.com',
  credentials: true
}));
```

---

## 📊 监控与日志

### 1. Nginx 日志

```bash
# 访问日志
tail -f /var/log/nginx/access.log

# 错误日志
tail -f /var/log/nginx/error.log
```

### 2. 应用监控

考虑集成以下监控工具：
- **Sentry**: 前端错误监控
- **Google Analytics**: 用户行为分析
- **PM2**: 进程管理（如果使用 Node.js 服务器）

### 3. 性能监控

使用 Lighthouse 进行性能评估：

```bash
npm install -g lighthouse
lighthouse https://your-domain.com --view
```

---

## 🔄 持续部署

### GitHub Actions 示例

创建 `.github/workflows/deploy.yml`：

```yaml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '14'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Build
      run: npm run build
      env:
        VUE_APP_API_BASE_URL: ${{ secrets.API_BASE_URL }}
    
    - name: Deploy to server
      uses: easingthemes/ssh-deploy@v2.1.5
      env:
        SSH_PRIVATE_KEY: ${{ secrets.SSH_PRIVATE_KEY }}
        ARGS: "-rltgoDzvO --delete"
        SOURCE: "dist/"
        REMOTE_HOST: ${{ secrets.REMOTE_HOST }}
        REMOTE_USER: ${{ secrets.REMOTE_USER }}
        TARGET: "/var/www/search-course"
```

---

## 🐛 常见问题

### 1. 404 错误（刷新页面）

**问题**: SPA 应用刷新页面时出现 404

**解决**: 确保 Web 服务器配置了 URL 重写，将所有请求重定向到 `index.html`

### 2. API 跨域问题

**问题**: 前端请求后端 API 出现 CORS 错误

**解决方案**:
- 在后端正确配置 CORS
- 或使用 Nginx 反向代理

### 3. 静态资源 404

**问题**: CSS/JS 文件加载失败

**解决**: 检查 `publicPath` 配置是否正确

### 4. Cookie 无法保存

**问题**: 登录状态无法保持

**解决**: 
- 检查 Cookie 的 domain 和 path 设置
- 确保使用 HTTPS（SameSite=Strict 需要）

---

## 📈 性能优化建议

### 1. CDN 加速

将静态资源托管到 CDN：

```javascript
// vue.config.js
module.exports = {
  publicPath: process.env.NODE_ENV === 'production'
    ? 'https://cdn.example.com/'
    : '/'
};
```

### 2. 代码分割

使用异步组件（已实现）：

```javascript
const AddCourse = defineAsyncComponent(() =>
  import('./components/AddCourse.vue')
);
```

### 3. 图片优化

- 使用 WebP 格式
- 压缩图片
- 实现懒加载（已实现）

### 4. 缓存策略

```nginx
# 强缓存静态资源
location ~* \.(js|css|png|jpg|jpeg|gif|ico|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# HTML 文件不缓存
location ~* \.html$ {
    expires -1;
    add_header Cache-Control "no-cache, no-store, must-revalidate";
}
```

---

## 🔄 更新部署

### 零停机更新

```bash
# 1. 构建新版本
npm run build

# 2. 备份当前版本
cp -r /var/www/search-course /var/www/search-course.backup

# 3. 部署新版本
cp -r dist/* /var/www/search-course/

# 4. 测试
curl -I https://your-domain.com

# 5. 如果有问题，回滚
# mv /var/www/search-course.backup /var/www/search-course
```

---

## 📞 支持

如有部署问题，请：
1. 检查服务器日志
2. 查看浏览器控制台错误
3. 提交 GitHub Issue

---

**文档版本**: v1.0  
**最后更新**: 2024  
**维护者**: CopyRight by JeredGong

