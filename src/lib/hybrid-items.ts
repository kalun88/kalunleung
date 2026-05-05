// Item descriptors for the hybrid (sticky-feature + dispatch-list) layout
// rendered by ProjectsHybrid.astro. The component is purely
// presentational; it just iterates HybridItem[]. Two builders feed it:
//
//   - buildHybridItemsFromPosts(posts)
//       Used historically for the portfolio "Selected Works" block.
//       Maps post fields onto the descriptor.
//
//   - buildHybridItemsFromHighlights(posts, gigs)
//       Used for the cross-collection homepage Highlights block. Mixes
//       CMS posts (any collection) with standalone Dates DB gigs into a
//       single ranked list. Posts and gigs both expose Highlight + Rank,
//       and gigs are coerced into the same HybridItem shape so the
//       hybrid layout never has to know what the source type is.
//
// The presentational invariants — image resolution, tag splitting (topical
// vs. location), year extraction — live here so both code paths produce
// identical rendering data.

import type { Post, Gig } from "@/lib/interfaces";
import { getPostLink, filePath } from "@/lib/blog-helpers";
import { MENU_PAGES_COLLECTION } from "@/constants";

export interface HybridItem {
	id: string;
	num: string;
	year: string;
	title: string;
	excerpt: string;
	tag: string;
	topical: string[];
	locations: string[];
	role: string;
	images: string[];
	href: string;
}

const LOCATION_TAG_RE = /.+\s\([A-Z]{2,3}\)$/;

function splitTags(tags: { name: string; color?: string }[] | undefined) {
	if (!tags) return { topical: [] as string[], locations: [] as string[] };
	const topical: string[] = [];
	const locations: string[] = [];
	for (const t of tags) {
		(LOCATION_TAG_RE.test(t.name) ? locations : topical).push(t.name);
	}
	return { topical, locations };
}

function getYear(dateStr: string | undefined): string {
	if (!dateStr) return "";
	const d = new Date(dateStr);
	return Number.isNaN(d.getTime()) ? "" : String(d.getFullYear());
}

// Resolve a FileObject-like to a usable image src. Mirrors the logic in
// PostPreviewWide/Medium and ProjectsHybrid (pre-extraction) so multi-image
// layouts stay consistent across components.
function imgSrc(img: { Type?: string; Url: string; OptimizedUrl?: string }): string {
	if (img.Type === "external") return img.Url;
	const u = img.OptimizedUrl || img.Url;
	if (u.startsWith("/")) return u;
	try {
		return filePath(new URL(u));
	} catch {
		return u;
	}
}

function postToItem(post: Post, num: string): HybridItem {
	const { topical, locations } = splitTags(post.Tags);
	const role = post.Role && post.Role.trim().length > 0 ? post.Role : topical.join(" · ");
	const images = (post.FeaturedImages || []).slice(0, 2).map(imgSrc);
	const year = getYear(post.Date);
	return {
		id: post.PageId,
		num,
		year,
		title: post.Title,
		excerpt: post.Excerpt,
		tag: topical[0] || "",
		topical,
		locations,
		role,
		images,
		href: getPostLink(post.Slug, post.Collection === MENU_PAGES_COLLECTION),
	};
}

function gigToItem(gig: Gig, num: string, fallbackHref: string): HybridItem {
	// City is a single string like "Toronto (CA)"; treat it as a location
	// tag so the rendered descriptor matches what posts produce.
	const locations = gig.City ? [gig.City] : [];
	// Excerpt: prefer Venue + " · " + Personnel; fall back to whichever is
	// set. This keeps the feature panel readable for date entries.
	const excerptParts: string[] = [];
	if (gig.Venue) excerptParts.push(gig.Venue);
	if (gig.Members) excerptParts.push(gig.Members);
	const excerpt = excerptParts.join(" · ");
	const role = gig.With || "";
	const images = (gig.FeaturedImages || []).slice(0, 2).map(imgSrc);
	const year = getYear(gig.Date);
	// Prefer the external EventLink; fall back to /collections/dates/.
	const href = gig.EventLink && gig.EventLink.length > 0 ? gig.EventLink : fallbackHref;
	return {
		id: gig.PageId,
		num,
		year,
		title: gig.Title,
		excerpt,
		// No topical tags from gigs — first topical-style tag comes from
		// the Ensemble (With) when present so the dispatch row still has a
		// bracketed label.
		tag: gig.With || "",
		topical: gig.With ? [gig.With] : [],
		locations,
		role,
		images,
		href,
	};
}

export function buildHybridItemsFromPosts(posts: Post[]): HybridItem[] {
	return posts.map((post, i) => postToItem(post, String(i + 1).padStart(2, "0")));
}

// Cross-collection Highlights builder. Takes whichever posts and gigs
// were already filtered to Highlight=true, sorts them together by Rank
// ascending (unranked last) with Date desc as tiebreaker, slices to
// `maxItems`, then maps to HybridItem descriptors.
//
// `maxItems` is optional — pass `undefined`, `null`, `0`, or `Infinity`
// to render every highlighted item (the user self-limits via Notion).
//
// `datesFallbackHref` is used when a gig has no EventLink — typically
// "/collections/dates/".
export function buildHybridItemsFromHighlights(
	posts: Post[],
	gigs: Gig[],
	maxItems: number | null | undefined,
	datesFallbackHref: string,
): HybridItem[] {
	type Mixed =
		| { kind: "post"; rank: number; date: number; post: Post }
		| { kind: "gig"; rank: number; date: number; gig: Gig };
	// Sort by HighlightRank — a dedicated number property on both DBs,
	// distinct from `Rank` (which is reused by nav-page ordering on the
	// CMS side). Missing values were already coerced to +Infinity in
	// _buildPost / _buildGig so unranked items sink to the end and
	// tiebreak on Date desc.
	const ranked: Mixed[] = [
		...posts.map<Mixed>((p) => ({
			kind: "post",
			rank: typeof p.HighlightRank === "number" ? p.HighlightRank : Number.POSITIVE_INFINITY,
			date: p.Date ? new Date(p.Date).getTime() : 0,
			post: p,
		})),
		...gigs.map<Mixed>((g) => ({
			kind: "gig",
			rank: typeof g.HighlightRank === "number" ? g.HighlightRank : Number.POSITIVE_INFINITY,
			date: g.Date ? new Date(g.Date).getTime() : 0,
			gig: g,
		})),
	];
	ranked.sort((a, b) => {
		// Treat NaN ranks as +Infinity so they sink to the end.
		const ar = Number.isFinite(a.rank) ? a.rank : Number.POSITIVE_INFINITY;
		const br = Number.isFinite(b.rank) ? b.rank : Number.POSITIVE_INFINITY;
		if (ar !== br) return ar - br;
		// Date desc tiebreaker (newer first).
		return b.date - a.date;
	});
	// No-limit cases: undefined / null / 0 / Infinity all mean "render
	// everything." Otherwise slice to the requested count.
	const limit =
		maxItems == null || !Number.isFinite(maxItems) || maxItems <= 0
			? ranked.length
			: maxItems;
	const sliced = ranked.slice(0, limit);
	return sliced.map((m, i) => {
		const num = String(i + 1).padStart(2, "0");
		return m.kind === "post" ? postToItem(m.post, num) : gigToItem(m.gig, num, datesFallbackHref);
	});
}
