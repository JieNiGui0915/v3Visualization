import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { execSync } from "child_process";
// https://vitejs.dev/config/
export default defineConfig(({ command, mode, isSsrBuild, isPreview }) => {
  const VERSION_DATE = 'git log -1 --format="%cd" --date=format:"%Y%m%d"';// 获取提交日期
  const VERSION_HASH = 'git describe --always'; // 获取git前8位提交哈希值
  let date = execSync(VERSION_DATE).toString();
  let commit_hash = execSync(VERSION_HASH).toString();
  process.env.VITE_GIT_COMMIT_VERSION = date + "-" + commit_hash;

  let prodMode = mode;
  if (mode === "production") {
    mode = "prod"
  }
  console.info("mode:" + mode);

  return {
    base: mode === "test" ? "/test/" : "/",
    server: {
      host: "0.0.0.0",
      port: 3300,
      open: true,
      cors: true,
      strictPort: true,
      hmr: true,
    },
    build: {
      outDir: "dist" + (mode ? "-" + mode : "")
    },
    plugins: [vue({
      template: {
        compilerOptions: {
          isCustomElement: (tag) => ["wx-open-subscribe"].includes(tag)
        }
      }
    })],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
    css: {
      preprocessorOptions: {
        less: {
          javascriptEnabled: true
        }
      }
    }
  }
})
