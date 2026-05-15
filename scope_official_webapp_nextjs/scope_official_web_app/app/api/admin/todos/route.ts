import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const SECRET = new TextEncoder().encode(
process.env.NEXTAUTH_SECRET || 'fallback-secret-key'
)

const GITHUB_TOKEN =
process.env.GITHUB_TOKEN ||
process.env.GH_TOKEN ||
''

const GITHUB_OWNER =
process.env.GITHUB_OWNER ||
''

const GITHUB_REPO =
process.env.GITHUB_REPO ||
''

function unauthorized() {
return NextResponse.json(
{ error: 'Unauthorized' },
{ status: 401 }
)
}

// Verify JWT token and ensure user has an allowed role
async function verifyToken(req: NextRequest): Promise<boolean> {
try {
const authHeader = req.headers.get('authorization')


if (!authHeader || !authHeader.startsWith('Bearer ')) {
  return false
}

const token = authHeader.substring(7)

const { payload } = await jwtVerify(token, SECRET)

const role =
  typeof payload.role === 'string'
    ? payload.role
    : ''

const allowedRoles = [
  'admin',
  'super_admin',
  'super-admin',
  'owner'
]

return allowedRoles.includes(role)


} catch (err) {
console.warn(
'[admin/git-history] Token verification failed:',
err
)
return false
}
}

// GET - Fetch GitHub commits from the last 7 days
export async function GET(req: NextRequest) {
const isAuthorized = await verifyToken(req)

if (!isAuthorized) {
return unauthorized()
}

try {
const perPage = 50


// Ensure GitHub repo details are configured
if (!GITHUB_OWNER || !GITHUB_REPO) {
  console.error(
    '[GET /api/admin/git-history] Missing GITHUB_OWNER or GITHUB_REPO'
  )

  return NextResponse.json(
    {
      error: 'GitHub owner/repo not configured on server'
    },
    { status: 500 }
  )
}

// GitHub API URL
const url =
  `https://api.github.com/repos/` +
  `${encodeURIComponent(GITHUB_OWNER)}/` +
  `${encodeURIComponent(GITHUB_REPO)}/commits?per_page=${perPage}`

// Request headers
const headers: Record<string, string> = {
  Accept: 'application/vnd.github+json'
}

if (GITHUB_TOKEN) {
  headers.Authorization = `Bearer ${GITHUB_TOKEN}`
}

// Fetch commits
const response = await fetch(url, {
  method: 'GET',
  headers,
  cache: 'no-store'
})

if (!response.ok) {
  const text = await response.text()

  console.error(
    '[GET /api/admin/git-history] GitHub API error:',
    response.status,
    text
  )

  return NextResponse.json(
    {
      error: 'GitHub API error',
      details: text
    },
    { status: 502 }
  )
}

const data = await response.json()

// Normalize commit data
const commits = (Array.isArray(data) ? data : []).map(
  (commit: any) => ({
    sha: commit.sha,
    author:
      commit.commit?.author?.name ||
      commit.author?.login ||
      null,
    email:
      commit.commit?.author?.email ||
      null,
    date:
      commit.commit?.author?.date ||
      commit.commit?.committer?.date ||
      null,
    message:
      commit.commit?.message ||
      '',
    url:
      commit.url ||
      null,
    html_url:
      commit.html_url ||
      null
  })
)

// Filter commits from the last 7 days
const sevenDaysAgo =
  Date.now() - 7 * 24 * 60 * 60 * 1000

const recentCommits = commits.filter(
  (commit: any) => {
    if (!commit.date) {
      return false
    }

    const commitDate = new Date(commit.date)

    if (isNaN(commitDate.getTime())) {
      return false
    }

    return (
      commitDate.getTime() >= sevenDaysAgo
    )
  }
)

// Sort newest first
recentCommits.sort(
  (a: any, b: any) => {
    const dateA = new Date(
      a.date || 0
    ).getTime()

    const dateB = new Date(
      b.date || 0
    ).getTime()

    return dateB - dateA
  }
)

return NextResponse.json(
  {
    commits: recentCommits
  },
  { status: 200 }
)


} catch (err) {
console.error(
'[GET /api/admin/git-history] Failed:',
err
)


return NextResponse.json(
  {
    error: 'Failed to fetch git history',
    details: String(err)
  },
  { status: 500 }
)


}
}
