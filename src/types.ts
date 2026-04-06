export type Bindings = {
  DB: D1Database
  R2: R2Bucket
  ADMIN_PASSWORD: string
}

export type HonoEnv = { Bindings: Bindings }
