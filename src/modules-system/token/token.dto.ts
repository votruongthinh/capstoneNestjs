// src/modules-system/token/token.types.ts

export interface AccessTokenPayload {
    userId: number;
  }
  
  export interface RefreshTokenPayload {
    userId: number;
  }