// =============================================
// Terabox + Diskwala Direct Link Extractor
// Cloudflare Workers v7.0 — WASM Appicrypt
// =============================================

import wasmModule from "./appicrypt-web-f-0_1_216-bg.wasm";

const NDUS_COOKIE = "YfM5cX8peHui5LcBXhMIAJbQRoQqiNedoP1MfNmO";
const DISKWALA_BASE = "https://ddudapidd.diskwala.com/api/v1";
const MAGIC = "eyJwIjoiZXlKa0lqb2lZVU5MU1VnNFVteHZkMDloVkc1NFRtNWxUWGRTVTNZMlpqRm9YMmhQWVdOSVlXVjFZa1V5TlVZM0xXcHZUakpVWjI1V0xVVkpRazkzVW1oUWNrWTFMVnBHTUVkVWRWQldVV2hXVTNCS1ZVeEtiMFp6V0dOcFEzbFRRVXAzTVVJNE9XeHFlWGMzU0ZOVmIyVTFUSEJhTVVwNVR6RlJVaTF1VlZsUmFpMTFhMjh5TTNvM2J6ZzJTbGR0TUdWUk9FTm5SVGxqUlVSVFYxWnFkRzlIYUc5MGJrVlJaWGxmZDFGWWNESjJhbFY0UmtSU01YSkJlRVpuTkVaTWMxUjBTbFpEWjNsWFUwUkVWblZEVGtaUVpETmpWVGRqYldVNFZFcEVOR1JMVWtSM05UaE5hVjltYjJoMUxXVlhRekkwT0VaSE9YaGhSR2x2VUdGTFNFeHhjbEp5YkhGSGNFUnFlbXh6WW5oTk5IQndZVmN6ZFc1S1NrdzJUMGR0VEhFeFRsZGlWa0p5U25FMllVaFRRV3hYWVZsTVJWa3djM2xMTWpKQloyYzRUMGRNZEdKWlNDMWxWa05KU2xkNGJrZEJZMGQxVldaMWNtVmpUbTB5WkU0dE1FcFJXR2RZZVhseFYxSjRTblUyTFhKTWJUaElRWFZ4YTJKalV6Z3laMFJQZGtkRlUwRk9YemRQYVdsWmRUQlFiMDVEYzFwdk5uaHVhVVYwTkhsSFRVODFXa1JLU0hWQ1lXMUZVa0pTTTNWU1VuaEZSMDlQVUVnNGFWQkVjME5rV1dOMFMzSXRkRGRyY0d0T1ZsUlZkak5NVkMxUlIwMXNVM1pXZUZWeE9GZHVRMGhPTUhGcFMwTnNTVTVJWjJWM1dqQlZVM2d6U1cxSk0wMWZaMnB0VUhOa01YTXlXbUkxYlVGaFIzRk9kekkwVFhaU1NFaFVSSGd5Y0VKUlUzcGFORGt6UVhBdE1IRjNSM0pTTFZoTlNUZHFXbFI0TUd4cVlVbHdVRzFyYzNkRVJGSjJORmRLTmtVMk9URmpObkEyZVVvNGEwMURhRTVQVFV4QmFERjZMVmN5TFVOTldVaFlhWEpYVm1GdWFsVlFhWFZCVDBFMGJFdERTSEU1TkdGd1dqZHpRbmwxV0hrM1ZYVnpRaTA1WjJSR2RpMDBTVlJVU0hSR01EWXRPR1ZEUlhKNFkyY3habk0xZGtaeVFXRjZlVU5NUzBVdFpXNVRkekZFWjB4c1RtTmxha1V0VDJSbGRXTTJWRGxPT1dZemVrSXpTREkzVVd4bmJrSjVZV1pITFROT1lXUlFSRmh5TkhoRWNVSlVVWEZrVFhSdFMxcHVOVlZUVWt0cmFITTVYMHA2V2spelVrTmFZekJxU0RSeFkwMXJXbkZDUVd3aUxDSndJam9pVFVacmQwVjNXVWhMYjFwSmVtb3dRMEZSV1VsTGIxcEplbW93UkVGUlkwUlJaMEZGZUc1bmR5MDJZMDFtYjFKdVoyMVBjbms1Y2tKYU5VSmxWM1ZCTmsxT05tcHJNa2hWZUZsNGNWOWhOSFZzUzIxblkyVmxPVFYyVkRSblgwZDNWMnhNYlZWWlRGQjZiWGRyWlhWdVJteGthblp1WDFoaVdsRTlQU0o5IiwicyI6IllYUGl5djlSVmczQlhhTmJLTkVxNTUzeTlSdW01WkQxTEhtdDhnVWhLc19ueWNpWHhxSlBVY040V2hjdnZnLWlldV9JQ01QU3BrVjlYME5CY2otSXl3PT0ifQ==";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

const cache = new Map();
const CACHE_DURATION = 2 * 60 * 60 * 1000;

// =============================================
// Appicrypt SDK — WASM se init karo
// =============================================
let sdkInstance = null;

async function getSDK() {
  if (sdkInstance) return sdkInstance;

  // SDK JS file se init karo
  const { default: init, setMagicFile, getCryptogram } = await import("./appicrypt_sdk.js");
  await init(wasmModule);
  await setMagicFile(MAGIC);
  sdkInstance = { getCryptogram };
  return sdkInstance;
}

// Canonical string banao (main.js se exact copy)
function canonicalize(e) {
  if (null === e || void 0 === e) return "";
  if ("object" !== typeof e) return JSON.stringify(e);
  if (Array.isArray(e)) return "[" + e.map(canonicalize).join(",") + "]";
  return "{" + Object.keys(e).sort().map(k => JSON.stringify(k) + ":" + canonicalize(e[k])).join(",") + "}";
}

async function makeAppicryptHeaders(method, urlPath, params = null, body = null) {
  const { getCryptogram } = await getSDK();
  const ts = Date.now().toString();

  const paramsStr = params ? canonicalize(params) : "";
  const bodyStr = body ? canonicalize(body) : "";
  const msg = `${method.toUpperCase()} ${urlPath} | params=${paramsStr} | body=${bodyStr} | ts=${ts}`;

  const hashBuffer = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(msg));
  const cryptogram = await getCryptogram(new Uint8Array(hashBuffer));

  return {
    "Content-Type": "application/json",
    "Appicrypt": cryptogram,
    "Appicrypt-ts": ts,
  };
}

// =============================================
// Diskwala API calls
// =============================================
async function diskwalaGet(path, params = {}) {
  const headers = await makeAppicryptHeaders("GET", path, params);
  const url = new URL(DISKWALA_BASE + path);
  Object.entries(params).forEach(([k, v]) => url.searchParams.append(k, v));
  const resp = await fetch(url.toString(), { headers });
  return await resp.json();
}

async function diskwalaPost(path, body = {}) {
  const headers = await makeAppicryptHeaders("POST", path, null, body);
  const resp = await fetch(DISKWALA_BASE + path, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  return await resp.json();
}

async function fetchDiskwalaData(fileId) {
  try {
    const info = await diskwalaGet("/file/info", { file_id: fileId });
    const fileData = info?.data || info || {};

    const filename = fileData.name || fileData.file_name || fileData.filename || `${fileId}.mp4`;
    const size = fileData.size || fileData.file_size || 0;
    const thumb = fileData.thumbnail || fileData.thumb || null;
    const isVideo = /\.(mp4|mov|mkv|webm|m4v|avi|flv|ts|3gp)$/i.test(filename);

    let dlink = "";
    try {
      if (isVideo) {
        const streamResp = await diskwalaPost("/file/video/stream", { file_id: fileId });
        dlink = streamResp?.url || streamResp?.stream_url || streamResp?.data?.url || "";
      }
      if (!dlink) {
        const dlResp = await diskwalaPost("/file/download", { file_id: fileId });
        dlink = dlResp?.url || dlResp?.download_url || dlResp?.data?.url || "";
      }
    } catch (_) {
      try {
        const signResp = await diskwalaPost("/file/sign", { file_id: fileId });
        dlink = signResp?.url || signResp?.data?.url || "";
      } catch (_) {}
    }

    const files = [{
      "📁 Name": filename,
      "📋 Type": "file",
      "📍 Full Path": filename,
      "✏️ Size": formatBytes(size),
      "🔗 Direct Download Link": dlink || null,
      "🖼 Thumbnails": thumb ? { default: thumb } : null,
    }];

    return {
      "✅ Status": "Success",
      "🍪 Cookie Status": {
        attempts: [{ cookie_index: 0, error: null, status: "success", success_details: {
          download_link_success_rate: dlink ? 100 : 0,
          files_with_download_links: dlink ? 1 : 0,
          total_files: 1,
        }}],
        success_criteria: "Minimum 50% of files must have download links",
        successful_cookie_index: 0,
        total_cookies_tried: 1,
      },
      "📂 Folders": [],
      "📄 Files": files,
      "📊 Summary": {
        "📂 Total Folders": 0,
        "📄 Total Files": 1,
        "🔢 Total Items": 1,
      },
    };
  } catch (err) {
    return { error: "Diskwala fetch failed: " + String(err) };
  }
}

// =============================================
// Terabox
// =============================================
async function fetchTeraboxData(surl) {
  let short_url = surl;
  if (surl.startsWith("1")) short_url = surl.substring(1);

  const cookieString = `ndus=${NDUS_COOKIE}`;
  const userAgent = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/145.0.0.0 Safari/537.36";

  const firstResp = await fetch(`https://dm.terabox.app/sharing/link?surl=${surl}`, {
    headers: { "User-Agent": userAgent, "Cookie": cookieString }
  });

  const text = await firstResp.text();
  const match = text.match(/fn%28%22(.*?)%22%29/);
  if (!match) return { error: "jsToken extract nahi hua. Cookie expire ho gayi hogi." };

  const jsToken = match[1];
  const api_url = new URL("https://dm.terabox.app/share/list");
  api_url.searchParams.append("app_id", "250528");
  api_url.searchParams.append("jsToken", jsToken);
  api_url.searchParams.append("site_referer", "https://www.terabox.app/");
  api_url.searchParams.append("shorturl", short_url);
  api_url.searchParams.append("root", "1");

  const apiResp = await fetch(api_url.toString(), {
    headers: {
      "Host": "dm.terabox.app",
      "User-Agent": userAgent,
      "Accept": "application/json, text/plain, */*",
      "Accept-Language": "en-US,en;q=0.9",
      "X-Requested-With": "XMLHttpRequest",
      "Referer": `https://dm.terabox.app/sharing/link?surl=${short_url}&clearCache=1`,
      "Content-Type": "application/x-www-form-urlencoded",
      "Origin": "https://dm.terabox.app",
      "Cookie": cookieString,
    }
  });

  const result = await apiResp.json();
  if (!result.list || result.list.length === 0) {
    return { error: "No files found. Link expired ya invalid hai.", raw: result };
  }

  const folders = result.list.filter(i => i.isdir === "1").map(i => ({
    "📁 Name": i.server_filename,
    "📋 Type": "folder",
    "📍 Full Path": i.path || i.server_filename,
  }));

  const files = result.list.filter(i => i.isdir !== "1").map(i => ({
    "📁 Name": i.server_filename,
    "📋 Type": "file",
    "📍 Full Path": i.path || i.server_filename,
    "✏️ Size": formatBytes(i.size),
    "🔗 Direct Download Link": i.dlink || null,
    "🖼 Thumbnails": i.thumbs || null,
  }));

  return {
    "✅ Status": "Success",
    "🍪 Cookie Status": {
      attempts: [{ cookie_index: 0, error: null, status: "success", success_details: {
        download_link_success_rate: 100,
        files_with_download_links: files.length,
        total_files: files.length,
      }}],
      success_criteria: "Minimum 50% of files must have download links",
      successful_cookie_index: 0,
      total_cookies_tried: 1,
    },
    "📂 Folders": folders,
    "📄 Files": files,
    "📊 Summary": {
      "📂 Total Folders": folders.length,
      "📄 Total Files": files.length,
      "🔢 Total Items": folders.length + files.length,
    },
  };
}

// =============================================
// Main Worker
// =============================================
export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders });
    }

    if (url.pathname === "/") {
      return Response.json({
        success: true,
        data: {
          "✅ Status": "Operational",
          "API": "TeraBox + Diskwala Downloader API v7.0",
          "Made By": "@AnujOfficial",
          "Usage": "/api?url=LINK",
        }
      }, { headers: corsHeaders });
    }

    if (url.pathname === "/api") {
      const teraUrl = url.searchParams.get("url");

      if (!teraUrl?.trim()) {
        return Response.json({ success: false, error: "URL parameter missing" }, { status: 400, headers: corsHeaders });
      }

      if (!isValidUrl(teraUrl)) {
        return Response.json({ success: false, error: "Invalid Terabox/Diskwala URL" }, { status: 400, headers: corsHeaders });
      }

      const id = extractId(teraUrl);
      if (!id) {
        return Response.json({ success: false, error: "Could not extract ID from URL" }, { status: 400, headers: corsHeaders });
      }

      const cached = cache.get(id);
      if (cached && Date.now() < cached.expiry) {
        return Response.json({ success: true, cached: true, data: cached.data }, { headers: corsHeaders });
      }

      const startTime = Date.now();
      const isDiskwala = teraUrl.includes("diskwala.com");

      try {
        const result = isDiskwala
          ? await fetchDiskwalaData(id)
          : await fetchTeraboxData(id);

        const responseTime = ((Date.now() - startTime) / 1000).toFixed(3) + "s";

        if (result.error) {
          return Response.json({
            success: false,
            error: result.error,
            "⏱ Response Time": responseTime,
          }, { status: 400, headers: corsHeaders });
        }

        const responseData = {
          ...result,
          "🔗 ShortLink": teraUrl,
          "⏱ Response Time": responseTime,
          "Made By": "@AnujOfficial",
          "API": "TeraBox + Diskwala Downloader API v7.0",
        };

        cache.set(id, { data: responseData, expiry: Date.now() + CACHE_DURATION });
        return Response.json({ success: true, cached: false, data: responseData }, { headers: corsHeaders });

      } catch (err) {
        return Response.json({ success: false, error: String(err) }, { status: 500, headers: corsHeaders });
      }
    }

    return Response.json({ success: false, error: "Not Found" }, { status: 404, headers: corsHeaders });
  }
};

// =============================================
// Utils
// =============================================
function isValidUrl(url) {
  const domains = [
    "terabox.app", "teraboxapp.com", "www.terabox.com", "dm.terabox.app",
    "1024terabox.com", "1024tera.com", "terabox.fun", "terasharefile.com",
    "terasharelink.com", "teraboxlink.com", "mirrobox.com", "nephobox.com",
    "freeterabox.com", "4funbox.com", "tibibox.com", "tobybox.com",
    "momerybox.com", "jobebox.com", "gibibox.com", "gomafiles.com",
    "boxlinks.net", "terabox.club", "terabox.site", "terabox.online",
    "terabox.live", "teraboxshare.com", "terafileshare.com", "teradlbox.com",
    "teradownload.app", "terabox.in", "diskwala.com",
  ];
  try {
    const parsed = new URL(url);
    return domains.some(d => parsed.hostname.includes(d));
  } catch { return false; }
}

function extractId(url) {
  try {
    const parsed = new URL(url);
    const pathMatch = parsed.pathname.match(/\/s\/([a-zA-Z0-9_-]+)/);
    if (pathMatch) return pathMatch[1];
    const diskwalaMatch = parsed.pathname.match(/\/(?:app|s|f|v|d|share|dl|download|file)\/([a-zA-Z0-9_-]+)/);
    if (diskwalaMatch) return diskwalaMatch[1];
    const surlParam = parsed.searchParams.get("surl");
    if (surlParam) return surlParam;
    return null;
  } catch { return null; }
}

function formatBytes(bytes) {
  if (!bytes || bytes === 0) return "0 B";
  bytes = parseInt(bytes);
  const units = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return (bytes / Math.pow(1024, i)).toFixed(2) + " " + units[i];
}
