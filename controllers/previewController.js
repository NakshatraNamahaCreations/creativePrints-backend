// controllers/previewController.js
import { load } from "cheerio";

// In Node 18+ global fetch and AbortController exist, so we don't import node-fetch.
// If you prefer node-fetch for older Node versions, keep your existing import.

const CACHE = new Map();
const CACHE_TTL_MS =
  (process.env.PREVIEW_CACHE_TTL_MS && Number(process.env.PREVIEW_CACHE_TTL_MS)) ||
  1000 * 60 * 10; // 10 minutes

function cacheSet(key, value) {
  CACHE.set(key, { value, t: Date.now() });
}
function cacheGet(key) {
  const rec = CACHE.get(key);
  if (!rec) return null;
  if (Date.now() - rec.t > CACHE_TTL_MS) {
    CACHE.delete(key);
    return null;
  }
  return rec.value;
}

/**
 * choose an image URL:
 * - prefer ogImage
 * - otherwise pick the largest <img> by declared dimensions (width*height) or first absolute <img>
 * - resolve relative urls against baseUrl
 * - ignore data: URIs for pickImage (they can be used, but often large)
 */
function pickImage(ogImage, html, baseUrl) {
  // helper to resolve a possibly-relative src to absolute url
  const tryResolve = (src) => {
    if (!src) return null;
    src = src.trim();
    // ignore tiny data URIs
    if (src.startsWith("data:")) return src; // we can still return data: if present
    try {
      return new URL(src, baseUrl).href;
    } catch (e) {
      return src;
    }
  };

  // prefer OG image if present
  if (ogImage) {
    try {
      const resolved = tryResolve(ogImage);
      return resolved;
    } catch (e) {
      // fall through
    }
  }

  if (!html) return null;

  try {
    const $ = load(html);
    const imgs = $("img")
      .map((i, el) => {
        const $el = $(el);
        const src = $el.attr("src") || $el.attr("data-src") || "";
        const w = parseInt($el.attr("width")) || 0;
        const h = parseInt($el.attr("height")) || 0;
        const area = w * h || 0;
        return { src: src || "", area };
      })
      .get()
      .filter((i) => i.src);

    if (imgs.length) {
      // pick the one with the largest declared area OR first with absolute URL if areas 0
      imgs.sort((a, b) => b.area - a.area);
      for (const img of imgs) {
        const candidate = tryResolve(img.src);
        if (candidate) return candidate;
      }
    }

    // last resort: try first <link rel="image_src">
    const linkImg = $('link[rel="image_src"]').attr("href");
    if (linkImg) return tryResolve(linkImg);
  } catch (e) {
    // ignore parsing errors, return null
  }

  return null;
}

function normalizeUrl(raw) {
  if (!raw) return null;
  try {
    // ensure proper scheme
    const u = new URL(raw);
    if (!/^https?:$/i.test(u.protocol)) return null;
    return u.href;
  } catch (e) {
    // attempt to add http:// if scheme missing
    try {
      const u2 = new URL("https://" + raw);
      return u2.href;
    } catch (err) {
      return null;
    }
  }
}

export async function getPreview(req, res) {
  const raw = req.query.url;
  if (!raw) return res.status(400).json({ ok: false, error: "missing url" });

  const target = normalizeUrl(raw);
  if (!target) return res.status(400).json({ ok: false, error: "invalid url" });

  const cacheKey = `preview:${target}`;
  const cached = cacheGet(cacheKey);
  if (cached) return res.json({ ok: true, ...cached });

  try {
    // small timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 8000);

    const resp = await fetch(target, {
      headers: { "User-Agent": "preview-bot/1.0 (+https://yourdomain.example)" },
      signal: controller.signal,
    });
    clearTimeout(timeout);

    if (!resp.ok) {
      return res
        .status(502)
        .json({ ok: false, error: "Fetch failed", status: resp.status });
    }

    const html = await resp.text();

    const $ = load(html);

    const ogTitle =
      $('meta[property="og:title"]').attr("content") ||
      $('meta[name="twitter:title"]').attr("content") ||
      null;

    const ogDesc =
      $('meta[property="og:description"]').attr("content") ||
      $('meta[name="description"]').attr("content") ||
      $('meta[name="twitter:description"]').attr("content") ||
      null;

    const ogImage =
      $('meta[property="og:image"]').attr("content") ||
      $('meta[name="twitter:image"]').attr("content") ||
      null;

    const titleTag = $("title").first().text() || null;

    const image = pickImage(ogImage, html, target);

    const data = {
      title: ogTitle || titleTag || "",
      description: ogDesc || "",
      image: image || null,
      url: target,
    };

    // cache result
    cacheSet(cacheKey, data);

    return res.json({ ok: true, ...data });
  } catch (err) {
    // Node AbortController throws a DOMException; display friendly error
    const message =
      err && err.name === "AbortError" ? "timeout fetching remote site" : (err && err.message) || String(err);
    console.warn("preview error:", message);
    return res.status(500).json({ ok: false, error: "preview error", details: message });
  }
}
