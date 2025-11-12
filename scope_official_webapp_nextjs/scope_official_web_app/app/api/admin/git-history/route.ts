import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'fallback-secret-key')
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || process.env.GH_TOKEN 
const GITHUB_OWNER = process.env.GITHUB_OWNER 
const GITHUB_REPO = process.env.GITHUB_REPO 

function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

async function verifyToken(req: NextRequest): Promise<boolean> {
  try {
    const authHeader = req.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) return false
    const token = authHeader.substring(7)
    const { payload } = await jwtVerify(token, SECRET)
    const role = typeof payload.role === 'string' ? payload.role : ''
    const allowed = ['admin', 'super_admin', 'super-admin', 'owner']
    return allowed.includes(role)
  } catch (err) {
    console.warn('[admin/git-history] Token verify failed', err)
    return false
  }
}

export async function GET(req: NextRequest) {
  const ok = await verifyToken(req)
  if (!ok) return unauthorized()

  try {
    // Use GitHub API to fetch recent commits for the configured repo.
    // This works on Netlify and serverless environments when a token is provided.
    const perPage = 50
    const url = `https://api.github.com/repos/${encodeURIComponent(GITHUB_OWNER)}/${encodeURIComponent(GITHUB_REPO)}/commits?per_page=${perPage}`

    const headers: Record<string,string> = { Accept: 'application/vnd.github+json' }
    if (GITHUB_TOKEN) headers['Authorization'] = `Bearer ${GITHUB_TOKEN}`

    const res = await fetch(url, { headers })
    if (!res.ok) {
      const text = await res.text()
      console.error('[GET /api/admin/git-history] GitHub API error', res.status, text)
      return NextResponse.json({ error: 'GitHub API error', details: text }, { status: 502 })
    }

    const data = await res.json()
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const commits = (Array.isArray(data) ? data : []).map((c: any) => ({
      sha: c.sha,
      author: c.commit?.author?.name || c.author?.login || null,
      email: c.commit?.author?.email || null,
      date: c.commit?.author?.date || c.commit?.committer?.date || null,
      message: c.commit?.message || c.message,
      url: c.url,
      html_url: c.html_url
    }))
    /* eslint-enable @typescript-eslint/no-explicit-any */

    // Only return commits from the last 7 days
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000
    const recentCommits = commits.filter((c: any) => {
      if (!c.date) return false
      const d = new Date(c.date)
      if (isNaN(d.getTime())) return false
      return d.getTime() >= sevenDaysAgo
    })

    return NextResponse.json({ commits: recentCommits })
  } catch (err) {
    console.error('[GET /api/admin/git-history] Failed to fetch GitHub commits', err)
    return NextResponse.json({ error: 'Failed to fetch git history', details: String(err) }, { status: 500 })
  }
}
