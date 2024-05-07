import { Inject, Injectable, Scope } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { REQUEST } from '@nestjs/core';
import { Request } from 'express';
import { ExtractJwt } from 'passport-jwt';
import * as process from 'process';

@Injectable({ scope: Scope.REQUEST })
export class Supabase {
  private clientInstance: SupabaseClient;

  constructor(@Inject(REQUEST) private readonly request: Request) {}

  /**
   * Cette fonction permet d'instancier un client Supabase authentifié grâce à un bearer token
   */
  getClient(withAuth = true) {
    if (this.clientInstance) {
      return this.clientInstance;
    }

    const header = withAuth
      ? {
          Authorization: `Bearer ${ExtractJwt.fromAuthHeaderAsBearerToken()(this.request)}`,
        }
      : {};
    this.clientInstance = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_KEY,
      {
        db: {
          schema: 'public',
        },
        auth: {
          persistSession: false,
          autoRefreshToken: true,
        },
        global: {
          headers: header,
        },
      },
    );

    return this.clientInstance;
  }
}
