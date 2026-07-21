import fs from 'fs/promises'
import path from 'path'

function localFile(filePath) {
  if (!filePath.startsWith('data/')) {
    throw new Error(`Ruta JSON no permitida: ${filePath}`)
  }
  return path.join(process.cwd(), 'data', filePath.slice('data/'.length))
}

function encodedContentPath(filePath) {
  return filePath.split('/').map(encodeURIComponent).join('/')
}

function githubConfig() {
  const token = process.env.GITHUB_TOKEN
  const inferredRepo = process.env.VERCEL_GIT_REPO_OWNER && process.env.VERCEL_GIT_REPO_SLUG
    ? `${process.env.VERCEL_GIT_REPO_OWNER}/${process.env.VERCEL_GIT_REPO_SLUG}`
    : ''
  const repo = process.env.GITHUB_REPO || inferredRepo
  const branch = process.env.GITHUB_BRANCH || process.env.VERCEL_GIT_COMMIT_REF || 'main'

  if (token && !repo) {
    throw new Error('GITHUB_REPO es obligatorio cuando GITHUB_TOKEN esta configurado.')
  }
  if (!token || !repo) return null
  return { token, repo, branch }
}

async function githubFetch(cfg, filePath, options = {}) {
  const { method = 'GET', body, raw = false, includeRef = true } = options
  const ref = includeRef ? `?ref=${encodeURIComponent(cfg.branch)}` : ''
  const url = `https://api.github.com/repos/${cfg.repo}/contents/${encodedContentPath(filePath)}${ref}`
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${cfg.token}`,
      Accept: raw ? 'application/vnd.github.raw+json' : 'application/vnd.github+json',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: 'no-store',
  })
  return res
}

async function readFromGithub(cfg, filePath) {
  const res = await githubFetch(cfg, filePath, { raw: true })
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`GitHub GET ${filePath} ${res.status}: ${detail.slice(0, 240)}`)
  }

  const text = await res.text()
  return JSON.parse(text)
}

async function getGithubFileSha(cfg, filePath) {
  const res = await githubFetch(cfg, filePath)
  if (res.status === 404) return null
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`GitHub metadata ${filePath} ${res.status}: ${detail.slice(0, 240)}`)
  }
  const meta = await res.json()
  return meta.sha || null
}

async function writeToGithub(cfg, filePath, data, commitMessage, attempt = 1) {
  const sha = await getGithubFileSha(cfg, filePath)
  const body = {
    message: `${commitMessage} (${new Date().toISOString()})`,
    content: Buffer.from(JSON.stringify(data, null, 2), 'utf8').toString('base64'),
    branch: cfg.branch,
    ...(sha ? { sha } : {}),
  }

  const res = await githubFetch(cfg, filePath, { method: 'PUT', body, includeRef: false })
  if (res.status === 409 && attempt < 2) {
    return writeToGithub(cfg, filePath, data, commitMessage, attempt + 1)
  }
  if (!res.ok) {
    const detail = await res.text().catch(() => '')
    throw new Error(`GitHub PUT ${filePath} ${res.status}: ${detail.slice(0, 240)}`)
  }

  return { source: 'github' }
}

export async function readJsonFile(filePath) {
  const cfg = githubConfig()
  if (cfg) {
    try {
      return await readFromGithub(cfg, filePath)
    } catch (err) {
      if (process.env.VERCEL || process.env.NODE_ENV === 'production') throw err
      console.error(`No se pudo leer ${filePath} desde GitHub, usando copia local:`, err.message)
    }
  }

  const text = await fs.readFile(localFile(filePath), 'utf8')
  return JSON.parse(text)
}

export async function writeJsonFile(filePath, data, commitMessage) {
  const cfg = githubConfig()
  if (cfg) return writeToGithub(cfg, filePath, data, commitMessage)

  await fs.writeFile(localFile(filePath), JSON.stringify(data, null, 2), 'utf8')
  return { source: 'local' }
}
