import { NextRequest, NextResponse } from 'next/server'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
})

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const date = searchParams.get('date')

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      )
    }

    // Query stealth_founders table
    const stealthFoundersQuery = `
      SELECT 
        entity_urn,
        linkedin_url,
        full_name,
        current_title,
        current_company,
        former_title,
        former_company,
        email,
        created_at
      FROM stealth_founders
      WHERE created_at = $1
      ORDER BY full_name
    `

    // Query free_agents table
    const freeAgentsQuery = `
      SELECT 
        entity_urn,
        linkedin_url,
        full_name,
        former_title,
        former_company,
        email,
        created_at
      FROM free_agents
      WHERE created_at = $1
      ORDER BY full_name
    `

    const [stealthFoundersResult, freeAgentsResult] = await Promise.all([
      pool.query(stealthFoundersQuery, [date]),
      pool.query(freeAgentsQuery, [date]),
    ])

    return NextResponse.json({
      stealthFounders: stealthFoundersResult.rows,
      freeAgents: freeAgentsResult.rows,
      date,
    })
  } catch (error) {
    console.error('Database query error:', error)
    return NextResponse.json(
      { error: 'Failed to query database', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

