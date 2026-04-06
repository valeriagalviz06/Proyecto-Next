import { supabase } from '@/utils/supabase'

export async function GET() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return Response.json({ error: 'Missing Supabase environment variables' }, { status: 500 })
  }

  try {
    // Test connection by getting the current user (will be null if not authenticated)
    const { data, error } = await supabase.auth.getUser()

    if (error) {
      const noSession = error.message?.includes('Auth session missing')
      return Response.json(
        {
          message: noSession ? 'Supabase connected, no authenticated user session found' : 'Supabase connected, auth request failed',
          auth: {
            status: noSession ? 'no-session' : 'error',
            error: error.message,
          },
          url: process.env.NEXT_PUBLIC_SUPABASE_URL,
        },
        { status: noSession ? 200 : 500 }
      )
    }

    return Response.json({ message: 'Supabase connection successful', user: data.user, url: process.env.NEXT_PUBLIC_SUPABASE_URL })
  } catch (err) {
    return Response.json({ error: 'Failed to connect to Supabase', details: err.message }, { status: 500 })
  }
}