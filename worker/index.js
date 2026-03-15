// Cloudflare Worker: Proxy feedback form submissions to GitHub Issues
// Secret required: GITHUB_TOKEN (GitHub Personal Access Token with public_repo scope)

const REPO_OWNER = "OOOHA";
const REPO_NAME = "OOOHA.github.io";

const ALLOWED_ORIGINS = [
  "https://oooha.github.io",
  "http://localhost:5173",  // Vite dev server
  "http://localhost:4173",  // Vite preview
];

const VALID_APPS = ["mozii", "map-memory", "gphones"];
const VALID_TYPES = ["bug", "feature", "job-offer"];
const VALID_WORK_TYPES = ["full-time", "part-time", "contract"];

// Simple in-memory rate limiting (resets on worker restart, which is fine for free tier)
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60_000; // 1 minute
const RATE_LIMIT_MAX = 3; // max 3 requests per minute per IP

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);

  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { windowStart: now, count: 1 });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }
  return false;
}

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

function jsonResponse(data, status, origin) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(origin),
    },
  });
}

async function createGitHubIssue(env, title, body, labels) {
  const url = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/issues`;
  const headers = {
    Authorization: `Bearer ${env.GITHUB_TOKEN}`,
    Accept: "application/vnd.github.v3+json",
    "Content-Type": "application/json",
    "User-Agent": "OOOHA-Feedback-Worker",
  };

  // First attempt: with labels
  const response = await fetch(url, {
    method: "POST",
    headers,
    body: JSON.stringify({ title, body, labels }),
  });

  if (response.ok) {
    return await response.json();
  }

  // If failed (likely 422 due to non-existent labels), retry without labels
  const errorText = await response.text();
  console.error("GitHub API error (with labels):", response.status, errorText);

  if (response.status === 422) {
    console.log("Retrying without labels...");
    const retryResponse = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({ title, body }),
    });

    if (retryResponse.ok) {
      return await retryResponse.json();
    }

    const retryError = await retryResponse.text();
    throw new Error(`GitHub API failed: ${retryResponse.status} ${retryError}`);
  }

  throw new Error(`GitHub API failed: ${response.status} ${errorText}`);
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];

    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(allowedOrigin),
      });
    }

    // Only accept POST
    if (request.method !== "POST") {
      return jsonResponse({ success: false, error: "Method not allowed" }, 405, allowedOrigin);
    }

    // Check origin
    if (!ALLOWED_ORIGINS.includes(origin)) {
      return jsonResponse({ success: false, error: "Forbidden" }, 403, allowedOrigin);
    }

    // Rate limiting
    const ip = request.headers.get("CF-Connecting-IP") || "unknown";
    if (isRateLimited(ip)) {
      return jsonResponse({ success: false, error: "Too many requests. Please wait a moment." }, 429, allowedOrigin);
    }

    // Parse body
    let body;
    try {
      body = await request.json();
    } catch {
      return jsonResponse({ success: false, error: "Invalid JSON" }, 400, allowedOrigin);
    }

    const { type } = body;

    // Validate type
    if (!type || !VALID_TYPES.includes(type)) {
      return jsonResponse({ success: false, error: "Invalid type" }, 400, allowedOrigin);
    }

    let issueTitle, issueBody, labels;

    if (type === "job-offer") {
      // Job offer validation
      const { email, name, company, position, workType, message } = body;

      if (!email || typeof email !== "string" || !email.includes("@")) {
        return jsonResponse({ success: false, error: "Valid email is required" }, 400, allowedOrigin);
      }
      if (email.length > 200) {
        return jsonResponse({ success: false, error: "Email too long" }, 400, allowedOrigin);
      }
      if (!message || typeof message !== "string" || message.trim().length === 0) {
        return jsonResponse({ success: false, error: "Message is required" }, 400, allowedOrigin);
      }
      if (message.length > 5000) {
        return jsonResponse({ success: false, error: "Message too long (max 5000 characters)" }, 400, allowedOrigin);
      }
      if (name && name.length > 100) {
        return jsonResponse({ success: false, error: "Name too long (max 100 characters)" }, 400, allowedOrigin);
      }
      if (company && company.length > 100) {
        return jsonResponse({ success: false, error: "Company too long (max 100 characters)" }, 400, allowedOrigin);
      }
      if (position && position.length > 100) {
        return jsonResponse({ success: false, error: "Position too long (max 100 characters)" }, 400, allowedOrigin);
      }
      if (workType && !VALID_WORK_TYPES.includes(workType)) {
        return jsonResponse({ success: false, error: "Invalid work type" }, 400, allowedOrigin);
      }

      const displayName = name?.trim() || "Anonymous";
      const displayPosition = position?.trim() || "General Inquiry";

      labels = ["job-offer", "from-web"];
      issueTitle = `[Job Offer] ${displayName} - ${displayPosition}`;

      const parts = [`## Job Offer\n`];
      parts.push(`**Email:** ${email.trim()}`);
      if (name?.trim()) parts.push(`**Name:** ${name.trim()}`);
      if (company?.trim()) parts.push(`**Company:** ${company.trim()}`);
      if (position?.trim()) parts.push(`**Position:** ${position.trim()}`);
      if (workType) parts.push(`**Work Type:** ${workType}`);
      parts.push(`\n### Message\n\n${message.trim()}`);
      parts.push(`\n---\n*Submitted via web form*`);
      issueBody = parts.join("\n");

    } else {
      // Bug report / Feature request validation
      const { app, title, description } = body;

      if (!app || !VALID_APPS.includes(app)) {
        return jsonResponse({ success: false, error: "Invalid app" }, 400, allowedOrigin);
      }
      if (!title || typeof title !== "string" || title.trim().length === 0) {
        return jsonResponse({ success: false, error: "Title is required" }, 400, allowedOrigin);
      }
      if (title.length > 200) {
        return jsonResponse({ success: false, error: "Title too long (max 200 characters)" }, 400, allowedOrigin);
      }
      if (!description || typeof description !== "string" || description.trim().length === 0) {
        return jsonResponse({ success: false, error: "Description is required" }, 400, allowedOrigin);
      }
      if (description.length > 5000) {
        return jsonResponse({ success: false, error: "Description too long (max 5000 characters)" }, 400, allowedOrigin);
      }

      labels = [
        type === "bug" ? "bug" : "enhancement",
        app,
        "from-web",
      ];

      const typeLabel = type === "bug" ? "Bug Report" : "Feature Request";
      issueTitle = `[${typeLabel}] [${app}] ${title.trim()}`;
      issueBody = `## ${typeLabel}\n\n**App:** ${app}\n\n${description.trim()}\n\n---\n*Submitted via web form*`;
    }

    // Create GitHub Issue (with automatic fallback if labels don't exist)
    try {
      const issue = await createGitHubIssue(env, issueTitle, issueBody, labels);
      return jsonResponse({
        success: true,
        issueUrl: issue.html_url,
        issueNumber: issue.number,
      }, 201, allowedOrigin);

    } catch (err) {
      console.error("Issue creation failed:", err.message);
      return jsonResponse({
        success: false,
        error: `Failed to create issue: ${err.message}`,
      }, 502, allowedOrigin);
    }
  },
};
