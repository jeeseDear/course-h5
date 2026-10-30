// 运行时环境标识，值来自 .env.fat / .env.production
export const appEnv = import.meta.env.VITE_APP_ENV || "fat"
export const appEnvName = import.meta.env.VITE_APP_ENV_NAME || "测试环境"
export const isFat = appEnv === "fat"
export const isProd = appEnv === "production"

// 接口前缀，当前页面数据均为本地 mock，接入真实接口时用它拼地址
export const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || ""
