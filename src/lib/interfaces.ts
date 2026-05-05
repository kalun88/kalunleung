import type { DatabaseProperties } from "./notion/responses";

/* eslint-disable prettier/prettier */
export interface Database {
	Title: string;
	Description: string;
	Icon: FileObject | Emoji | null;
	Cover: FileObject | null;
	propertiesRaw: DatabaseProperties;
	LastUpdatedTimeStamp: Date;
}

export interface Post {
	PageId: string;
	Title: string;
	Collection: string;
	Icon: FileObject | Emoji | null;
	Cover: FileObject | null;
	Slug: string;
	Date: string;
	Venue?: string;
	Tags: SelectProperty[];
	Excerpt: string;
	FeaturedImage: FileObject | null;
	FeaturedImages: FileObject[]; // Array of all featured images for multi-image layouts
	Rank: number;
	// Manual ordering inside the homepage Highlights block. Distinct
	// from `Rank` (which is reused by nav-page ordering and other
	// callers). Lower = earlier; entries without a value sink to the end
	// and tiebreak by Date desc.
	HighlightRank: number;
	LastUpdatedDate: string;
	LastUpdatedTimeStamp: Date;
	Pinned: boolean;
	// Independent of `Pinned`. `Pinned` controls collection-page ordering;
	// `Highlight` promotes the post to the cross-collection homepage
	// Highlights block. A post can be Pinned, Highlighted, both, or
	// neither.
	Highlight: boolean;
	// Per-section homepage promotion flag. Drives the homepage News
	// strip when `homepage-collections.▉ news` is configured with
	// `use-show-on-homepage-news: true`. Decoupled from `Highlight` so
	// the cross-collection Highlights block and the News block can each
	// be curated independently.
	ShowOnHomepageNews: boolean;
	BlueSkyPostLink: string | "";
	// Redesign-specific rich_text properties on the Posts DB.
	// Empty string when the row has no value set.
	Role: string;
	Status: string;
	HeroQuote: string;
	HeroQuoteCitation: string;
	// Hero subtitle is split across three rich-text rows so each visual line
	// can be controlled independently in Notion. Stored as RichText[] so
	// inline formatting (bold/italic/underline/strike/code/color) is
	// preserved end-to-end. An empty array means "row not set" — empty rows
	// are skipped at render time, so a single populated row still renders
	// as one line.
	SubtitleRow1: RichText[];
	SubtitleRow2: RichText[];
	SubtitleRow3: RichText[];
}

export interface Gig {
	PageId: string;
	Title: string;
	Date: string;
	DateEnd?: string; // For residencies with date ranges
	Venue: string;
	With: string; // Band/ensemble name
	Members: string; // Personnel list
	EventLink: string;
	City: string; // Format: "Toronto (CA)"
	Residency: boolean;
	// Cross-collection homepage promotion. Mirrors Post.Highlight: when
	// true, the gig is eligible for the homepage Highlights block.
	Highlight: boolean;
	// Manual ordering inside the homepage Highlights block. Lower =
	// earlier; gigs without a value fall to the end and tiebreak by Date
	// desc. Same name/semantics as Post.HighlightRank so both source
	// types sort consistently in the mixed list.
	HighlightRank: number;
	// Hero/feature image for the Highlights layout. Mirrors the file
	// property on the CMS DB so dates can show a feature image in the
	// projects-hybrid sticky panel. Missing image → soft-grey placeholder.
	FeaturedImage: FileObject | null;
	FeaturedImages: FileObject[];
	LastUpdatedTimeStamp: Date;
}

export interface Block {
	Id: string;
	Type: BlockTypes;
	HasChildren: boolean;
	LastUpdatedTimeStamp: Date;

	Paragraph?: Paragraph;
	Heading1?: Heading1;
	Heading2?: Heading2;
	Heading3?: Heading3;
	BulletedListItem?: BulletedListItem;
	NumberedListItem?: NumberedListItem;
	ToDo?: ToDo;
	NImage?: NImage;
	NAudio?: NAudio;
	File?: File;
	Code?: Code;
	Quote?: Quote;
	Equation?: Equation;
	Callout?: Callout;
	SyncedBlock?: SyncedBlock;
	Toggle?: Toggle;
	Embed?: Embed;
	Video?: Video;
	Bookmark?: Bookmark;
	LinkPreview?: LinkPreview;
	Table?: Table;
	ColumnList?: ColumnList;
	TableOfContents?: TableOfContents;
	LinkToPage?: LinkToPage;
}

export interface ReferencesInPage {
	block: Block;
	other_pages: RichText[];
	external_hrefs: RichText[];
	same_page: RichText[];
	direct_media_link: string | null;
	link_to_pageid: string | null;
	direct_nonmedia_link: string | null;
}

export interface Paragraph {
	RichTexts: RichText[];
	Color: string;
	Children?: Block[];
}

export interface Heading1 {
	RichTexts: RichText[];
	Color: string;
	IsToggleable: boolean;
	Children?: Block[];
}

export interface Heading2 {
	RichTexts: RichText[];
	Color: string;
	IsToggleable: boolean;
	Children?: Block[];
}

export interface Heading3 {
	RichTexts: RichText[];
	Color: string;
	IsToggleable: boolean;
	Children?: Block[];
}

export interface BulletedListItem {
	RichTexts: RichText[];
	Color: string;
	Children?: Block[];
}

export interface NumberedListItem {
	RichTexts: RichText[];
	Color: string;
	Children?: Block[];
}

export interface ToDo {
	RichTexts: RichText[];
	Checked: boolean;
	Color: string;
	Children?: Block[];
}

export interface NImage {
	Caption: RichText[];
	Type: string;
	File?: FileObject;
	External?: External;
	Width?: number;
	Height?: number;
}

export interface Video {
	Caption: RichText[];
	Type: string;
	External?: External;
	File?: FileObject;
	Width?: number;
	Height?: number;
	Size?: number;
}

export interface NAudio {
	Caption: RichText[];
	Type: string;
	External?: External;
	File?: FileObject;
}

export interface File {
	Caption: RichText[];
	Type: string;
	File?: FileObject;
	External?: External;
}

export interface FileObject {
	Type: string;
	Url: string;
	OptimizedUrl?: string;
	ExpiryTime?: string;
	Size?: number;
}

export interface External {
	Url: string;
}

export interface Code {
	Caption: RichText[];
	RichTexts: RichText[];
	Language: string;
}

export interface Quote {
	RichTexts: RichText[];
	Color: string;
	Children?: Block[];
}

export interface Equation {
	Expression: string;
}

export interface Callout {
	RichTexts: RichText[];
	Icon: FileObject | Emoji | null;
	Color: string;
	Children?: Block[];
}

export interface SyncedBlock {
	SyncedFrom: SyncedFrom | null;
	Children?: Block[];
}

export interface SyncedFrom {
	BlockId: string;
}

export interface Toggle {
	RichTexts: RichText[];
	Color: string;
	Children: Block[];
}

export interface Embed {
	Caption: RichText[];
	Url: string;
}

export interface Bookmark {
	Caption: RichText[];
	Url: string;
}

export interface LinkPreview {
	Caption: RichText[];
	Url: string;
}

export interface Table {
	TableWidth: number;
	HasColumnHeader: boolean;
	HasRowHeader: boolean;
	Rows: TableRow[];
}

export interface TableRow {
	Id: string;
	Type: string;
	HasChildren: boolean;
	Cells: TableCell[];
}

export interface TableCell {
	RichTexts: RichText[];
}

export interface ColumnList {
	Columns: Column[];
}

export interface Column {
	Id: string;
	Type: string;
	HasChildren: boolean;
	Children: Block[];
}

export interface List {
	Type: string;
	ListItems: Block[];
}

export interface TableOfContents {
	Color: string;
}

export interface RichText {
	Text?: Text;
	Annotation: Annotation;
	PlainText: string;
	Href?: string;
	Equation?: Equation;
	Mention?: Mention;
	InternalHref?: Reference;
}

export interface Text {
	Content: string;
	Link?: Link;
}

export interface Emoji {
	Type: string;
	Emoji: string;
}

export interface Annotation {
	Bold: boolean;
	Italic: boolean;
	Strikethrough: boolean;
	Underline: boolean;
	Code: boolean;
	Color: string;
}

export interface Link {
	Url: string;
}

export interface SelectProperty {
	id: string;
	name: string;
	color: string;
	description: string;
}

export interface LinkToPage {
	Type: string;
	PageId: string;
}

export interface Mention {
	Type: string;
	Page?: Reference;
	DateStr?: string;
	LinkMention?: LinkMention | undefined;
	CustomEmoji?: CustomEmojiMention | undefined;
}

export interface LinkMention {
	Href: string;
	Title: string;
	IconUrl?: string;
	Description?: string;
	LinkAuthor?: string;
	ThumbnailUrl?: string;
	Height?: number;
	IframeUrl?: string;
	LinkProvider?: string;
}

export interface CustomEmojiMention {
	Name: string;
	Url?: string;
}

export interface Reference {
	PageId: string;
	Type: string;
	BlockId?: string;
}

export type BlockTypes =
	| "bookmark"
	| "breadcrumb"
	| "code"
	| "bulleted_list_item"
	| "callout"
	| "child_database"
	| "child_page"
	| "column"
	| "column_list"
	| "divider"
	| "embed"
	| "equation"
	| "file"
	| "heading_1"
	| "heading_2"
	| "heading_3"
	| "image"
	| "link_preview"
	| "link_to_page"
	| "numbered_list_item"
	| "paragraph"
	| "pdf"
	| "quote"
	| "synced_block"
	| "table"
	| "table_of_contents"
	| "table_row"
	| "template"
	| "to_do"
	| "toggle"
	| "video"
	| "audio";
