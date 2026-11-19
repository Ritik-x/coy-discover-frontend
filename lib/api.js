const API_URL = process.env.NEXT_PUBLIC_API_URL;

async function request(path, options = {}) {
  if (!API_URL) {
    throw new Error("NEXT_PUBLIC_API_URL is not configured");
  }

  let response;

  try {
    response = await fetch(`${API_URL.replace(/\/$/, "")}${path}`, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    });
  } catch {
    throw new Error("Cannot connect to the Discover API. Please try again.");
  }

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `Request failed (${response.status})`);
  }

  return data;
}

export function getFeed() {
  return request("/feed");
}

export function postSwipe(profileId, action) {
  return request("/swipe", {
    method: "POST",
    body: JSON.stringify({ profileId, action }),
  });
}

export function getMatches() {
  return request("/matches");
}

export function resetSwipes() {
  return request("/reset", { method: "POST" });
}
