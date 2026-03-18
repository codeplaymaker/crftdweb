/**
 * Google Places API scraper.
 * Finds businesses by niche + city using the Places Text Search API.
 * Returns up to 60 results (3 pages of 20).
 *
 * Requires: GOOGLE_PLACES_API_KEY env var
 */

const API_KEY = () => process.env.GOOGLE_PLACES_API_KEY!;

interface PlaceResult {
  name: string;
  place_id: string;
  formatted_address: string;
  types: string[];
  rating?: number;
  user_ratings_total?: number;
  business_status?: string;
  website?: string;
  formatted_phone_number?: string;
}

interface TextSearchResponse {
  results: PlaceResult[];
  next_page_token?: string;
  status: string;
}

interface PlaceDetailsResponse {
  result: {
    website?: string;
    formatted_phone_number?: string;
    international_phone_number?: string;
  };
  status: string;
}

/**
 * Search for businesses using Google Places Text Search.
 * Fetches up to `maxResults` (default 60, max 60 due to API pagination).
 */
export async function searchBusinesses(
  niche: string,
  city: string,
  maxResults = 60,
): Promise<PlaceResult[]> {
  const all: PlaceResult[] = [];
  let pageToken: string | undefined;
  const pages = Math.min(Math.ceil(maxResults / 20), 3); // Max 3 pages (60 results)

  for (let page = 0; page < pages; page++) {
    const params = new URLSearchParams({
      query: `${niche} in ${city}`,
      key: API_KEY(),
    });

    if (pageToken) {
      params.set('pagetoken', pageToken);
      // Google requires a short delay before using next_page_token
      await sleep(2000);
    }

    const res = await fetch(
      `https://maps.googleapis.com/maps/api/place/textsearch/json?${params}`,
    );
    const data: TextSearchResponse = await res.json();

    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      throw new Error(`Google Places API error: ${data.status}`);
    }

    // Filter to only OPERATIONAL businesses
    const active = data.results.filter(
      (r) => r.business_status !== 'CLOSED_PERMANENTLY',
    );
    all.push(...active);

    pageToken = data.next_page_token;
    if (!pageToken) break;
  }

  return all.slice(0, maxResults);
}

/**
 * Get website + phone for a place using Place Details.
 * We only request the fields we need to keep cost low ($0.017 per call with Contact data).
 */
export async function getPlaceDetails(
  placeId: string,
): Promise<{ website: string | null; phone: string | null }> {
  const params = new URLSearchParams({
    place_id: placeId,
    fields: 'website,formatted_phone_number,international_phone_number',
    key: API_KEY(),
  });

  const res = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?${params}`,
  );
  const data: PlaceDetailsResponse = await res.json();

  return {
    website: data.result?.website || null,
    phone:
      data.result?.international_phone_number ||
      data.result?.formatted_phone_number ||
      null,
  };
}

/**
 * Full pipeline: search + enrich each result with website/phone.
 */
export async function scrapeBusinesses(
  niche: string,
  city: string,
  maxResults = 20,
) {
  const places = await searchBusinesses(niche, city, maxResults);

  // Enrich in batches of 5 to avoid rate limits
  const enriched: Array<Omit<PlaceResult, 'website'> & { website: string | null; phone: string | null }> = [];

  for (let i = 0; i < places.length; i += 5) {
    const batch = places.slice(i, i + 5);
    const details = await Promise.all(
      batch.map((p) => getPlaceDetails(p.place_id)),
    );

    batch.forEach((place, idx) => {
      enriched.push({
        ...place,
        website: details[idx].website ?? null,
        phone: details[idx].phone ?? null,
      });
    });
  }

  return enriched;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
