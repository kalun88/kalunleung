//NOTE ADDED
import { getAllPages, getDataSource } from "@/lib/notion/client";
import type { Block, BlockTypes } from "@/lib/interfaces";
import { MENU_PAGES_COLLECTION, HOME_PAGE_SLUG, HIDE_UNDERSCORE_SLUGS_IN_LISTS, NAV_ORDER } from "@/constants";
import { slugify } from "@/utils/slugify";
import { getNavLink } from "@/lib/blog-helpers";
export { getFormattedDate, getFormattedDateWithTime, areDifferentDates } from "@/utils/date";
export { generateToc, buildHeadings } from "@/utils/generateToc";
export type { TocItem } from "@/utils/generateToc";
export { getWebmentionsForUrl } from "@/utils/webmentions";
export { slugify } from "@/utils/slugify";

export async function getCollections() {
	const { propertiesRaw } = await getDataSource();

	return propertiesRaw.Collection.select!.options.map(({ name }) => name).filter(
		(name) => name !== MENU_PAGES_COLLECTION,
	);
}

export async function getTagsNameWDesc() {
	const { propertiesRaw } = await getDataSource();
	const options = propertiesRaw.Tags?.multi_select?.options || [];

	const mappedOptions = options.reduce((acc, option) => {
		acc[option.name] = option.description || "";
		return acc;
	}, {});

	return mappedOptions;
}

export async function getCollectionsWDesc() {
	const { propertiesRaw } = await getDataSource();

	return propertiesRaw.Collection.select!.options.filter(
		({ name }) => name !== MENU_PAGES_COLLECTION,
	).map(({ name, description }) => ({ name, description }));
}

export async function getMenu(): Promise<
	{ title: string; path: string; isExternal?: boolean; children?: { title: string; path: string }[] }[]
> {
	// If nav-order is configured, use it for complete control
	if (NAV_ORDER && NAV_ORDER.length > 0) {
		const pages = await getAllPages();
		const collections = await getCollections();
		
		const menuItems = [];
		
		for (const item of NAV_ORDER) {
			if (item.type === 'page' && item.slug) {
				// Find the page by slug
				const page = pages.find(p => p.Slug === item.slug);
				if (page) {
					menuItems.push({
						title: item.title || page.Title,
						path: getNavLink(page.Slug === HOME_PAGE_SLUG ? "/" : "/" + page.Slug),
					});
				}
			} else if (item.type === 'collection' && item.name) {
				// Check if collection exists
				if (collections.includes(item.name)) {
					menuItems.push({
						title: item.title || item.name,
						path: getNavLink("/collections/" + slugify(item.name)),
					});
				}
			} else if (item.type === 'external' && item.url) {
				// External link
				menuItems.push({
					title: item.title,
					path: item.url,
					isExternal: true,
				});
			}
		}
		
		return menuItems;
	}

	// Fallback to original logic if no nav-order is configured
	const pages = await getAllPages();
	const collections = await getCollections();
	const collectionLinks = collections.map((name) => ({
		title: name,
		path: getNavLink("/collections/" + slugify(name)),
	}));

	const filteredPages = HIDE_UNDERSCORE_SLUGS_IN_LISTS
		? pages.filter((page) => !page.Slug.startsWith("_"))
		: pages;

	const pageLinks = filteredPages
		.map((page) => ({
			...page,
			// Assign rank -1 to homePageSlug and 99 to pages with no rank
			Rank:
				page.Slug === HOME_PAGE_SLUG
					? -1
					: page.Rank === undefined || page.Rank === null
						? 99
						: page.Rank,
		}))
		.sort((a, b) => a.Rank - b.Rank)
		.map((page) => ({
			title: page.Title,
			path: getNavLink(page.Slug === HOME_PAGE_SLUG ? "/" : "/" + page.Slug),
		}));

	return [...pageLinks, ...collectionLinks];
}
