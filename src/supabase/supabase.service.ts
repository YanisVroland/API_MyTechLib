import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SUPABASE_CONFIG } from '../../supabase.config';

@Injectable()
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      SUPABASE_CONFIG.supabaseUrl,
      SUPABASE_CONFIG.supabaseKey,
    );
  }
}
