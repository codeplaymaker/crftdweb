declare global {
  namespace NodeJS {
    interface ProcessEnv {
      EMAIL_PASSWORD: string;
    }
  }
}
