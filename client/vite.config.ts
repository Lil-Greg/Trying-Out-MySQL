import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// 20:42: 
// environment vairables not being read, .gitignore is not the reason
// 21:18: loadEnv does not work
// 21:32: asked ChatGPT, it said to set the root argument to the root
// which the env file is located
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '../', '');

  const host = env.VITE_CLIENT_HOST ? env.VITE_CLIENT_HOST : undefined;
  const port = env.VITE_CLIENT_PORT ? parseInt(env.VITE_CLIENT_PORT) : undefined;

  return {
    plugins: [react()],
    server: {
      host,
      port
    },
    envDir: "../"
  }
}
);
