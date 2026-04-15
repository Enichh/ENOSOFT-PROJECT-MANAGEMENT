interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_LONGCAT_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
