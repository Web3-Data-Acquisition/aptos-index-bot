# 使用官方的 Node.js 轻量级镜像作为基础镜像
FROM node:lts-slim AS base

# 安装 openssl
RUN apt-get update && apt-get install -y openssl

# 设置工作目录
WORKDIR /usr/src

# 基于 base 镜像创建一个 builder 镜像
FROM base AS builder

# 将 package.json 和 package-lock.json 复制到工作目录中
COPY package*.json ./
RUN npm install -g pnpm
# 安装所有依赖，包括 devDependencies
RUN pnpm install

# 复制项目的所有源文件到工作目录中
COPY . .

# 运行类型检查
RUN pnpm run typecheck


# 基于 base 镜像创建一个 runner 镜像
FROM base AS runner


# 将 package.json 和 package-lock.json 复制到工作目录中
COPY package*.json ./

# 安装仅生产环境需要的依赖
RUN npm install -g pnpm
RUN pnpm install

# 复制项目的所有源文件到工作目录中
COPY . .

# # 运行 Prisma generate
# RUN npx prisma generate

# 切换到非 root 用户
USER node

# 启动应用
CMD ["npm", "run", "start:force"]
