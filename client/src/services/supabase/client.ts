// Supabase removed; Firebase-only stack now. Provide a minimal stub so legacy imports don't break at build time.
type QueryChain = {
  select: (cols?: string) => Promise<{ data: any; error: any }>
  eq: (col: string, val: any) => QueryChain
  order: (col: string, opts?: { ascending?: boolean }) => QueryChain
  limit: (n: number) => QueryChain
  single: () => Promise<{ data: any; error: any }>
  insert: (rows: any[]) => { single: () => Promise<{ data: any; error: any }> }
  update: (values: any) => { eq: (col: string, val: any) => { single: () => Promise<{ data: any; error: any }> } }
  delete: () => { eq: (col: string, val: any) => Promise<{ error: any }> }
}

export const supabase = {
  from(_table: string): QueryChain {
    const chain: any = {
      select: async () => ({ data: [], error: null }),
      eq: () => chain,
      order: () => chain,
      limit: () => chain,
      single: async () => ({ data: null, error: null }),
      insert: () => ({ single: async () => ({ data: null, error: null }) }),
      update: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
      delete: () => ({ eq: async () => ({ error: null }) }),
    }
    return chain
  },
} as const

