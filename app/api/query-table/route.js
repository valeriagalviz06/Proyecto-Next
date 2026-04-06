import { supabase } from '../../../utils/supabase'

const validTableName = (name) => /^[a-zA-Z0-9_]+$/.test(name)

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const table = searchParams.get('table')

  if (!table) {
    return Response.json({ error: 'Missing table query parameter' }, { status: 400 })
  }

  if (!validTableName(table)) {
    return Response.json({ error: 'Invalid table name' }, { status: 400 })
  }

  const { data, error } = await supabase.from(table).select('*').limit(100)

  if (error) {
    return Response.json({ error: error.message, details: error.details }, { status: 500 })
  }

  return Response.json({ table, rows: data })
}
