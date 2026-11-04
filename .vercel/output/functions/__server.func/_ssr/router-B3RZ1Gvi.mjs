import { i as __toESM } from "../_runtime.mjs";
import { C as require_jsx_runtime, S as useRouter, Y as require_react, _ as lazyRouteComponent, b as Link, d as Scripts, f as HeadContent, g as Outlet, h as createRouter, p as useRouterState, v as createFileRoute, x as useNavigate, y as createRootRoute } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-B3RZ1Gvi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 bg-paper px-6 text-center text-ink",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-accent",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 1.5
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-4xl font-bold uppercase",
				children: "The desk hit an error"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-mute",
				children: errorMessage(error)
			})
		]
	});
}
/**
* Path-based preview hosts serve the dev server under `/{port_id}/` and strip
* that prefix before forwarding, so SSR sees `/` while the browser URL keeps the
* prefix. TanStack Start resets `basepath` on hydration, so a `rewrite` keeps
* client routing and generated links aligned with the public URL.
*/
var PATH_BASED_PREVIEW_HOSTS = /* @__PURE__ */ new Set([
	"preview.grok.genai.mil",
	"preview.grok.mil",
	"preview.grokgsac.com"
]);
var PORT_ID_PREFIX = /^\/hds-[a-z0-9]+-\d+-[a-z0-9]+(?=\/|$)/i;
function previewPathPrefix(hostname, pathname) {
	if (!PATH_BASED_PREVIEW_HOSTS.has(hostname.toLowerCase())) return void 0;
	return PORT_ID_PREFIX.exec(pathname)?.[0];
}
function prefixRewrite(prefix) {
	return {
		input: ({ url }) => {
			if (url.pathname === prefix) url.pathname = "/";
			else if (url.pathname.startsWith(`${prefix}/`)) url.pathname = url.pathname.slice(prefix.length);
			return url;
		},
		output: ({ url }) => {
			url.pathname = `${prefix}${url.pathname}`;
			return url;
		}
	};
}
function previewPathRewrite() {
	if (typeof window === "undefined") return void 0;
	const prefix = previewPathPrefix(window.location.hostname, window.location.pathname);
	return prefix ? prefixRewrite(prefix) : void 0;
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var STAR_DU = {
	label: "The Daily Star — DU applications open 11 Nov",
	url: "https://online.thedailystar.net/campus/news/dhaka-university-admission-applications-open-nov-11-2026-27-session-4238521",
	published: "2026-08-02"
};
var STAR_CLASH = {
	label: "The Daily Star — eight institutions announce schedules",
	url: "https://online.thedailystar.net/news/education/news/university-admission-tests-2026-27-date-clashes-emerge-8-institutions-announce-schedules-4260196",
	published: "2026-08-30"
};
var STAR_RETAKE = {
	label: "The Daily Star — schedules and the HSC retake",
	url: "https://www.thedailystar.net/news/bangladesh/education/news/admission-schedule-medical-colleges-univs-mull-relief-hsc-retakers-4315036",
	published: "2026-11-04"
};
function C(partial) {
	return {
		session: "2026-27",
		pdfUrl: null,
		applicationOpens: null,
		opensAt: null,
		applicationCloses: null,
		closesAt: null,
		admitCardOn: null,
		examDate: null,
		examTime: null,
		resultOn: null,
		classesBegin: null,
		feeBdt: null,
		feeNote: "",
		seats: null,
		eligibility: [],
		units: [],
		notes: [],
		...partial
	};
}
var UNIT_UNKNOWN = "Subject group not named in the stored reports.";
var seedCirculars = [
	C({
		id: "c-du",
		universityId: "du",
		title: "University of Dhaka undergraduate admission 2026–27",
		summary: "The General Admission Committee, chaired by Vice-Chancellor Prof ABM Obaidul Islam, set the application window and five unit tests. Reported from a university press release. The PDF circular is not stored in this archive.",
		system: "own",
		publication: "notice",
		confidence: "notice",
		confidenceNote: "Dates come from a Daily Star report of the 2 Aug 2026 committee decision and a university press release. Restated as the existing timeline on 4 Nov 2026. No official PDF is linked here.",
		sources: [
			STAR_DU,
			STAR_CLASH,
			STAR_RETAKE
		],
		updatedOn: "2026-11-04",
		applicationOpens: "2026-11-11",
		opensAt: "12:00",
		applicationCloses: "2026-11-25",
		closesAt: "23:59",
		examDate: "2026-12-05",
		classesBegin: "2027-03-28",
		eligibility: [
			"HSC or equivalent must be 2026. Applicants from earlier HSC batches are not eligible (The Daily Star, 4 Nov 2026).",
			"Unit-wise minimum GPA figures were not printed in the Daily Star reports stored here.",
			"Arts, Law and Social Science, Science, and Business Studies papers: 60 marks MCQ and 40 marks written (The Daily Star, 2 Aug 2026).",
			"Fine Arts: 40-mark MCQ and 60-mark drawing. IBA: 70-mark MCQ and 30-mark descriptive (The Daily Star, 2 Aug 2026).",
			"English-medium candidates in the Science unit get a separate question paper (The Daily Star, 2 Aug 2026)."
		],
		units: [
			{
				code: "IBA",
				detail: "Institute of Business Administration. 70 MCQ + 30 descriptive.",
				examDate: "2026-12-05",
				examTime: null,
				centre: "Outside centres were not stated for IBA."
			},
			{
				code: "Science",
				detail: "Science unit. Separate paper for English-medium candidates. 60 MCQ + 40 written.",
				examDate: "2026-12-12",
				examTime: null,
				centre: "Dhaka, RU, CU, KU, University of Barishal, SUST, BAU Mymensingh, BRUR."
			},
			{
				code: "A/Law/Social",
				detail: "Arts, Law and Social Science. 60 MCQ + 40 written.",
				examDate: "2026-12-19",
				examTime: null,
				centre: "Dhaka, RU, CU, KU, University of Barishal, SUST, BAU Mymensingh, BRUR."
			},
			{
				code: "Fine Arts",
				detail: "40-mark MCQ and 60-mark drawing.",
				examDate: "2026-12-22",
				examTime: null,
				centre: "Outside centres were not stated for Fine Arts."
			},
			{
				code: "Business",
				detail: "Business Studies. 60 MCQ + 40 written.",
				examDate: "2026-12-26",
				examTime: null,
				centre: "Dhaka, RU, CU, KU, University of Barishal, SUST, BAU Mymensingh, BRUR."
			}
		],
		notes: [
			"First-year classes are scheduled to begin 28 Mar 2027.",
			"Application fee, seat count and admit-card date were not in the stored reports.",
			"A later retake policy may still move these dates. See the watch item on the overview."
		]
	}),
	C({
		id: "c-jnu",
		universityId: "jnu",
		title: "Jagannath University undergraduate admission 2026–27",
		summary: "An official university release set a five-unit MCQ schedule, all of it in Dhaka. The PDF is not stored in this archive.",
		system: "own",
		publication: "notice",
		confidence: "notice",
		confidenceNote: "The Daily Star (30 Aug 2026) cites an official university release. Restated 4 Nov 2026.",
		sources: [STAR_CLASH, STAR_RETAKE],
		updatedOn: "2026-11-04",
		applicationOpens: "2026-11-15",
		opensAt: "12:00",
		applicationCloses: "2026-12-10",
		closesAt: "23:59",
		examDate: "2027-01-01",
		examTime: "10:00–11:00",
		eligibility: ["Eligibility and GPA bars were not in the stored reports."],
		units: [
			{
				code: "A",
				detail: "Science and Life and Earth Sciences. MCQ.",
				examDate: "2027-01-01",
				examTime: "10:00–11:00",
				centre: "Dhaka"
			},
			{
				code: "E",
				detail: UNIT_UNKNOWN + " MCQ.",
				examDate: "2027-01-08",
				examTime: "10:00–11:00",
				centre: "Dhaka"
			},
			{
				code: "B",
				detail: UNIT_UNKNOWN + " MCQ.",
				examDate: "2027-01-15",
				examTime: "10:00–11:00",
				centre: "Dhaka"
			},
			{
				code: "C",
				detail: UNIT_UNKNOWN + " MCQ.",
				examDate: "2027-01-22",
				examTime: "10:00–11:00",
				centre: "Dhaka"
			},
			{
				code: "D",
				detail: UNIT_UNKNOWN + " MCQ.",
				examDate: "2027-01-23",
				examTime: "10:00–11:00",
				centre: "Dhaka"
			}
		],
		notes: ["All five tests are one hour, 10:00 to 11:00, in Dhaka.", "Fee, seats, admit card and result date were not in the stored reports."]
	}),
	C({
		id: "c-ru",
		universityId: "ru",
		title: "University of Rajshahi undergraduate admission 2026–27",
		summary: "Preliminary application window and three unit dates, recommended by an admission sub-committee. Not described as a final circular.",
		system: "own",
		publication: "decision",
		confidence: "preliminary",
		confidenceNote: "The Public Relations Office told The Daily Star the dates were recommended at a sub-committee meeting on 16 Aug 2026. The 30 Aug report calls them preliminary.",
		sources: [STAR_CLASH, STAR_RETAKE],
		updatedOn: "2026-11-04",
		applicationOpens: "2026-11-12",
		applicationCloses: "2026-11-27",
		examDate: "2027-01-08",
		eligibility: ["Eligibility was not in the stored reports."],
		units: [
			{
				code: "B",
				detail: UNIT_UNKNOWN,
				examDate: "2027-01-08",
				examTime: null,
				centre: "Not stated."
			},
			{
				code: "C",
				detail: UNIT_UNKNOWN,
				examDate: "2027-01-09",
				examTime: null,
				centre: "Not stated."
			},
			{
				code: "A",
				detail: UNIT_UNKNOWN,
				examDate: "2027-01-16",
				examTime: null,
				centre: "Not stated."
			}
		],
		notes: ["The 12–27 Nov window is a preliminary application period, not confirmed here as the final circular.", "Fee, seats and admit-card date were not in the stored reports."]
	}),
	C({
		id: "c-cu",
		universityId: "cu",
		title: "University of Chittagong undergraduate admission 2026–27",
		summary: "Probable test dates from a notice signed by the secretary of the admission committee. The article itself calls the dates probable.",
		system: "own",
		publication: "notice",
		confidence: "preliminary",
		confidenceNote: "The Daily Star (30 Aug 2026) says CU set probable dates and cites a notice signed by the admission committee secretary. Treat the calendar as not final.",
		sources: [STAR_CLASH, STAR_RETAKE],
		updatedOn: "2026-11-04",
		applicationOpens: "2026-11-15",
		applicationCloses: "2026-12-10",
		examDate: "2027-01-29",
		eligibility: ["Eligibility was not in the stored reports."],
		units: [
			{
				code: "C",
				detail: UNIT_UNKNOWN,
				examDate: "2027-01-29",
				examTime: null,
				centre: "CU, DU and RU campuses."
			},
			{
				code: "A",
				detail: UNIT_UNKNOWN,
				examDate: "2027-01-30",
				examTime: null,
				centre: "CU, DU and RU campuses."
			},
			{
				code: "B1",
				detail: "Sub-unit. Subject not named.",
				examDate: "2027-02-03",
				examTime: null,
				centre: "CU campus only."
			},
			{
				code: "B2",
				detail: "Sub-unit. Subject not named.",
				examDate: "2027-02-04",
				examTime: null,
				centre: "CU campus only."
			},
			{
				code: "B",
				detail: UNIT_UNKNOWN,
				examDate: "2027-02-05",
				examTime: null,
				centre: "CU, DU and RU campuses."
			},
			{
				code: "D",
				detail: UNIT_UNKNOWN,
				examDate: "2027-02-06",
				examTime: null,
				centre: "CU, DU and RU campuses."
			},
			{
				code: "D1",
				detail: "Sub-unit. Subject not named.",
				examDate: "2027-02-08",
				examTime: null,
				centre: "CU campus only."
			}
		],
		notes: ["Main unit tests at the CU, DU and RU campuses. Sub-unit tests only at CU.", "Opening time of day was not stated. Fee, seats and admit card were not stated."]
	}),
	C({
		id: "c-cou",
		universityId: "cou",
		title: "Comilla University application deadline 2026–27",
		summary: "Only a closing date is on file. Opening day, units and the test calendar were not in the stored report.",
		system: "own",
		publication: "decision",
		confidence: "reported",
		confidenceNote: "The Daily Star (4 Nov 2026) says Comilla University has set 10 Dec 2026 as the application deadline, with tests planned for later dates. No notice URL is stored here.",
		sources: [STAR_RETAKE],
		updatedOn: "2026-11-04",
		applicationCloses: "2026-12-10",
		eligibility: ["Eligibility was not in the stored report."],
		notes: ["Do not invent an opening date or an examination date for CoU."]
	}),
	C({
		id: "c-ku",
		universityId: "ku",
		title: "Khulna University undergraduate admission 2026–27",
		summary: "Test days from an official notice signed by acting registrar Prof SM Mahbubur Rahman, after a Central Admission Committee meeting on 24 Aug 2026. Application dates were not in the report.",
		system: "own",
		publication: "notice",
		confidence: "notice",
		confidenceNote: "The Daily Star (30 Aug 2026) cites the signed notice. Application window is still unknown.",
		sources: [STAR_CLASH, STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2026-12-17",
		eligibility: ["Eligibility was not in the stored reports."],
		units: [{
			code: "C & D",
			detail: UNIT_UNKNOWN,
			examDate: "2026-12-17",
			examTime: null,
			centre: "Not stated."
		}, {
			code: "A & B",
			detail: UNIT_UNKNOWN,
			examDate: "2026-12-18",
			examTime: null,
			centre: "Not stated."
		}],
		notes: ["Application opening, closing, fee, seats and admit card were not in the stored reports."]
	}),
	C({
		id: "c-kuet",
		universityId: "kuet",
		title: "KUET undergraduate admission test 2026–27",
		summary: "The special Academic Council on 25 Aug 2026 fixed the test. The same report said application procedure, eligibility and other details would be announced later in the admission circular.",
		system: "engineering",
		publication: "decision",
		confidence: "notice",
		confidenceNote: "Test date is from a cited Academic Council decision. The circular itself was explicitly not yet published as of the 30 Aug 2026 report.",
		sources: [STAR_CLASH, STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2027-01-08",
		eligibility: ["Eligibility will be in the circular. It was not announced in the stored reports."],
		notes: ["MCQ test, held the same day in Khulna, Dhaka and Rajshahi.", "Do not treat 8 Jan 2027 as proof that applications are open."]
	}),
	C({
		id: "c-mist",
		universityId: "mist",
		title: "MIST undergraduate admission tests 2026–27",
		summary: "A notice from the institute set two test days. Application dates were not in the report.",
		system: "specialized",
		publication: "notice",
		confidence: "notice",
		confidenceNote: "The Daily Star (30 Aug 2026) says the dates come from a notice published by the institute.",
		sources: [STAR_CLASH, STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2026-12-18",
		eligibility: ["Eligibility was not in the stored reports."],
		units: [{
			code: "C",
			detail: "Science.",
			examDate: "2026-12-18",
			examTime: null,
			centre: "Not stated."
		}, {
			code: "A & B",
			detail: "Engineering and Architecture.",
			examDate: "2026-12-19",
			examTime: null,
			centre: "Not stated."
		}],
		notes: ["Application window, fee, seats and admit card were not in the stored reports."]
	}),
	C({
		id: "c-ruet",
		universityId: "ruet",
		title: "RUET undergraduate admission test 2026–27",
		summary: "The admission-test steering committee provisionally fixed a date on 29 Aug 2026.",
		system: "engineering",
		publication: "decision",
		confidence: "preliminary",
		confidenceNote: "The Daily Star calls the 14 Jan 2027 date provisional. Application details were not published in that report.",
		sources: [STAR_CLASH, STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2027-01-14",
		eligibility: ["Eligibility was not in the stored reports."],
		notes: ["Do not treat this as an open circular."]
	}),
	C({
		id: "c-buet",
		universityId: "buet",
		title: "BUET undergraduate admission test 2026–27",
		summary: "A Daily Star timeline says BUET has fixed the test for 16 Jan 2027. No BUET notice URL or application window is stored in this archive.",
		system: "engineering",
		publication: "decision",
		confidence: "reported",
		confidenceNote: "Stated as fixed in The Daily Star, 4 Nov 2026. This desk has not logged a BUET circular, fee, or eligibility sheet for 2026–27. Earlier BUET circulars from the previous session are not reused here.",
		sources: [STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2027-01-16",
		eligibility: ["Eligibility was not in the stored report."],
		notes: ["Application opening, closing, fee, seats and admit card are NOT ANNOUNCED in this archive.", "Do not copy last year's BUET fee or dates into this session."]
	}),
	C({
		id: "c-cuet",
		universityId: "cuet",
		title: "CUET undergraduate admission test 2026–27",
		summary: "Only a proposed test date is on file.",
		system: "engineering",
		publication: "decision",
		confidence: "preliminary",
		confidenceNote: "The Daily Star (4 Nov 2026) says CUET has proposed 23 Jan 2027. It does not cite a published circular.",
		sources: [STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2027-01-23",
		eligibility: ["Eligibility was not in the stored report."],
		notes: ["Application window is NOT ANNOUNCED."]
	}),
	C({
		id: "c-gst",
		universityId: "gst",
		title: "GST cluster admission tests 2026–27",
		summary: "Twenty universities. Tests on three days in March 2027. Application dates were not announced, and the member list was not published in the stored report.",
		system: "gst",
		publication: "decision",
		confidence: "reported",
		confidenceNote: "The Daily Star (4 Nov 2026) says there may be more room to move these dates because applications are not open yet. Membership is intentionally blank in this archive.",
		sources: [STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2027-03-19",
		eligibility: ["Eligibility was not in the stored report."],
		units: [
			{
				code: "Day 1",
				detail: "Cluster test day. Paper split not announced.",
				examDate: "2027-03-19",
				examTime: null,
				centre: "Not stated."
			},
			{
				code: "Day 2",
				detail: "Cluster test day. Paper split not announced.",
				examDate: "2027-03-20",
				examTime: null,
				centre: "Not stated."
			},
			{
				code: "Day 3",
				detail: "Cluster test day. Paper split not announced.",
				examDate: "2027-03-27",
				examTime: null,
				centre: "Not stated."
			}
		],
		notes: ["Do not mark a university as a GST member until the official list is logged.", "Universities already running their own tests in the stored reports — DU, RU, CU, JnU, KU — are not placed in this cluster."]
	}),
	C({
		id: "c-agri",
		universityId: "agri",
		title: "Agricultural cluster combined test 2026–27",
		summary: "Nine universities, coordinated by Sher-e-Bangla Agricultural University. Combined test on 2 Jan 2027. Detailed application arrangements were not announced.",
		system: "agricultural",
		publication: "decision",
		confidence: "reported",
		confidenceNote: "The Daily Star (4 Nov 2026) says the cluster has fixed 2 January. It does not name the nine universities or the application window.",
		sources: [STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2027-01-02",
		eligibility: ["Eligibility was not in the stored report."],
		notes: ["Coordinator cited: Sher-e-Bangla Agricultural University.", "This archive does not assign individual agricultural universities to the cluster."]
	}),
	C({
		id: "c-dghs",
		universityId: "dghs",
		title: "MBBS and BDS admission test 2026–27",
		summary: "The medical and dental admission test is tentatively planned for 4 Dec 2026. Nothing else from the circular is on file.",
		system: "medical",
		publication: "decision",
		confidence: "preliminary",
		confidenceNote: "The Daily Star (4 Nov 2026) uses the word tentatively. Fee, seats, eligibility and the application window are not stored here.",
		sources: [STAR_RETAKE],
		updatedOn: "2026-11-04",
		examDate: "2026-12-04",
		eligibility: ["Eligibility was not in the stored report."],
		notes: ["This is the DGHS / government medical college test, not a medical university's postgraduate admission.", "The retake discussion may move this date. It is not confirmed."]
	})
];
var EVIDENCE_COPY = [
	"OFFICIAL NOTICE CITED — a news report quotes a university notice, press release, or signed decision. The PDF is linked only when this archive actually has a URL.",
	"REPORTED — a newsroom stated the date. This desk has not stored the underlying document.",
	"REPORTED · NOT FINAL — the source itself calls the date proposed, probable, provisional or tentative.",
	"NOT ANNOUNCED — this archive does not have the fact. It is not a guess and it is not last year's number.",
	"MARKED VERIFIED ON THIS DESK — your own check. It does not rewrite the source grade."
];
var MEDICAL_UNI = "This is a medical university. Government MBBS and BDS seats are filled through the central DGHS test, which is a separate record in this archive. No 2026–27 circular for this university is stored here.";
function U(id, name, shortName, track, city, website, extra) {
	return {
		id,
		kind: "university",
		name,
		shortName,
		nameBn: "",
		track,
		tags: [],
		city,
		website,
		admissionUrl: null,
		directoryNote: "",
		...extra
	};
}
var seedUniversities = [
	U("du", "University of Dhaka", "DU", "general", "Dhaka", "https://www.du.ac.bd", {
		nameBn: "ঢাকা বিশ্ববিদ্যালয়",
		directoryNote: "Runs its own undergraduate admission. Not part of the GST cluster in the 2026–27 reports stored here."
	}),
	U("ru", "University of Rajshahi", "RU", "general", "Rajshahi", "https://www.ru.ac.bd", {
		nameBn: "রাজশাহী বিশ্ববিদ্যালয়",
		directoryNote: "Runs its own undergraduate admission. The stored 2026–27 dates are still marked preliminary by the university's own public relations office."
	}),
	U("cu", "University of Chittagong", "CU", "general", "Chattogram", "https://www.cu.ac.bd", {
		nameBn: "চট্টগ্রাম বিশ্ববিদ্যালয়",
		directoryNote: "Runs its own undergraduate admission. Stored 2026–27 test dates were described as probable."
	}),
	U("ju", "Jahangirnagar University", "JU", "general", "Savar, Dhaka", "https://www.juniv.edu", {
		nameBn: "জাহাঙ্গীরনগর বিশ্ববিদ্যালয়",
		directoryNote: "No 2026–27 notice is stored in this archive."
	}),
	U("iu", "Islamic University, Bangladesh", "IU", "general", "Kushtia", "https://www.iu.ac.bd", {
		nameBn: "ইসলামী বিশ্ববিদ্যালয়",
		directoryNote: "No 2026–27 notice is stored in this archive. Do not assume GST membership until a circular names it."
	}),
	U("ku", "Khulna University", "KU", "general", "Khulna", "https://www.ku.ac.bd", {
		nameBn: "খুলনা বিশ্ববিদ্যালয়",
		directoryNote: "Runs its own undergraduate admission for 2026–27, according to a notice cited by The Daily Star."
	}),
	U("jnu", "Jagannath University", "JnU", "general", "Dhaka", "https://www.jnu.ac.bd", {
		nameBn: "জগন্নাথ বিশ্ববিদ্যালয়",
		directoryNote: "Runs its own undergraduate admission. Not the same institution as Jahangirnagar University (JU)."
	}),
	U("cou", "Comilla University", "CoU", "general", "Cumilla", "https://www.cou.ac.bd", {
		nameBn: "কুমিল্লা বিশ্ববিদ্যালয়",
		directoryNote: "A 4 Nov 2026 Daily Star timeline gives an application deadline only. Opening date and test dates are not in that report."
	}),
	U("jkkniu", "Jatiya Kabi Kazi Nazrul Islam University", "JKKNIU", "general", "Trishal, Mymensingh", "https://www.jkkniu.edu.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("brur", "Begum Rokeya University, Rangpur", "BRUR", "general", "Rangpur", "https://www.brur.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive. BRUR is also named as a Dhaka University outside centre, which is not a BRUR admission circular." }),
	U("bu", "University of Barishal", "BU", "general", "Barishal", "https://www.bu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("rub", "Rabindra University, Bangladesh", "RUB", "general", "Shahjadpur, Sirajganj", "https://www.rub.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("neu", "Netrokona University", "NeU", "general", "Netrokona", "https://neu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("kiu", "Kishoreganj University", "KiU", "general", "Kishoreganj", "https://bsmru.ac.bd", { directoryNote: "UGC's public list still publishes the pre-rename host bsmru.ac.bd. No 2026–27 notice is stored here." }),
	U("nau", "Naogaon University", "NaU", "general", "Naogaon", null, { directoryNote: "UGC's public list does not publish a website. No 2026–27 notice is stored here." }),
	U("meu", "Meherpur University", "MeU", "general", "Meherpur", null, { directoryNote: "UGC's public list does not publish a website. No 2026–27 notice is stored here." }),
	U("thu", "Thakurgaon University", "ThU", "general", "Thakurgaon", null, { directoryNote: "UGC's public list does not publish a website. No 2026–27 notice is stored here." }),
	U("ub", "University of Bogura", "UB", "general", "Bogura", "https://www.ub.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("dcu", "Dhaka Central University", "DCU", "general", "Dhaka", "https://dcu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("buet", "Bangladesh University of Engineering & Technology", "BUET", "engineering", "Dhaka", "https://www.buet.ac.bd", {
		nameBn: "বাংলাদেশ প্রকৌশল বিশ্ববিদ্যালয়",
		directoryNote: "Own undergraduate test. A 4 Nov 2026 Daily Star timeline says the test date is fixed. This archive does not have the circular URL."
	}),
	U("cuet", "Chittagong University of Engineering & Technology", "CUET", "engineering", "Chattogram", "https://www.cuet.ac.bd", {
		nameBn: "চট্টগ্রাম প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়",
		directoryNote: "The only stored 2026–27 date is a proposed test day. Not a confirmed circular."
	}),
	U("kuet", "Khulna University of Engineering & Technology", "KUET", "engineering", "Khulna", "https://www.kuet.ac.bd", {
		nameBn: "খুলনা প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়",
		directoryNote: "Academic Council fixed a test date. The Daily Star explicitly said the application circular was still to come."
	}),
	U("ruet", "Rajshahi University of Engineering & Technology", "RUET", "engineering", "Rajshahi", "https://www.ruet.ac.bd", {
		nameBn: "রাজশাহী প্রকৌশল ও প্রযুক্তি বিশ্ববিদ্যালয়",
		directoryNote: "Test date was provisionally fixed. Not a confirmed circular."
	}),
	U("duet", "Dhaka University of Engineering & Technology", "DUET", "engineering", "Gazipur", "https://www.duet.ac.bd", { directoryNote: "DUET's undergraduate entry has historically been a diploma-to-degree route, not the BUET-style HSC test. The 2026–27 circular is not stored here." }),
	U("sust", "Shahjalal University of Science & Technology", "SUST", "science-technology", "Sylhet", "https://www.sust.edu", { directoryNote: "No 2026–27 notice is stored here. SUST is also named as a Dhaka University outside centre, which is not a SUST circular." }),
	U("hstu", "Hajee Mohammad Danesh Science & Technology University", "HSTU", "science-technology", "Dinajpur", "https://www.hstu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("mbstu", "Mawlana Bhashani Science & Technology University", "MBSTU", "science-technology", "Tangail", "https://www.mbstu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("pstu", "Patuakhali Science and Technology University", "PSTU", "science-technology", "Patuakhali", "https://www.pstu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("nstu", "Noakhali Science and Technology University", "NSTU", "science-technology", "Noakhali", "https://www.nstu.edu.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("just", "Jessore University of Science & Technology", "JUST", "science-technology", "Jashore", "https://www.just.edu.bd", { directoryNote: "UGC's public list still uses the spelling Jessore. No 2026–27 notice is stored here." }),
	U("pust", "Pabna University of Science and Technology", "PUST", "science-technology", "Pabna", "https://www.pust.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("gstu", "Gopalganj Science & Technology University", "GSTU", "science-technology", "Gopalganj", "https://www.gstu.edu.bd", { directoryNote: "No 2026–27 notice is stored in this archive. Not the same thing as the GST admission cluster." }),
	U("rmstu", "Rangamati Science and Technology University", "RMSTU", "science-technology", "Rangamati", "https://www.rmstu.edu.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("jstu", "Jamalpur Science and Technology University", "JSTU", "science-technology", "Jamalpur", "https://bsfmstu.ac.bd", { directoryNote: "UGC's public list still publishes the pre-rename host bsfmstu.ac.bd. No 2026–27 notice is stored here." }),
	U("cstu", "Chandpur Science and Technology University", "CSTU", "science-technology", "Chandpur", "https://www.cstu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("sstu", "Sunamganj Science and Technology University", "SSTU", "science-technology", "Sunamganj", "https://www.sstu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("prstu", "Pirojpur Science & Technology University", "PRSTU", "science-technology", "Pirojpur", "https://www.prstu.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("lstu", "Lakshmipur Science & Technology University", "LSTU", "science-technology", "Lakshmipur", null, { directoryNote: "UGC's public list does not publish a website. No 2026–27 notice is stored here." }),
	U("nrstu", "Narayanganj Science and Technology University", "NrSTU", "science-technology", "Narayanganj", null, { directoryNote: "UGC's public list does not publish a website. No 2026–27 notice is stored here." }),
	U("uftb", "University of Frontier Technology, Bangladesh", "UFTB", "science-technology", "Gazipur", "https://www.uftb.ac.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("bau", "Bangladesh Agricultural University", "BAU", "agricultural", "Mymensingh", "https://www.bau.edu.bd", {
		nameBn: "বাংলাদেশ কৃষি বিশ্ববিদ্যালয়",
		directoryNote: "No 2026–27 BAU circular is stored here. BAU is named as a Dhaka University outside centre, which is not a BAU admission circular. Membership of this year's nine-university agricultural cluster was not published in the stored report."
	}),
	U("gau", "Gazipur Agricultural University", "GAU", "agricultural", "Gazipur", "https://gau.edu.bd", { directoryNote: "No 2026–27 notice is stored here. Cluster membership for 2026–27 was not named in the stored report." }),
	U("sau", "Sher-e-Bangla Agricultural University", "SAU", "agricultural", "Dhaka", "https://www.sau.edu.bd", {
		nameBn: "শেরেবাংলা কৃষি বিশ্ববিদ্যালয়",
		directoryNote: "The Daily Star (4 Nov 2026) names Sher-e-Bangla Agricultural University as coordinator of the nine-university agricultural cluster. The nine members were not listed. This is not the same host as Sylhet Agricultural University."
	}),
	U("sylau", "Sylhet Agricultural University", "SylAU", "agricultural", "Sylhet", "https://www.sau.ac.bd", { directoryNote: "Host on the UGC list is sau.ac.bd — not Sher-e-Bangla (sau.edu.bd). No 2026–27 notice is stored here." }),
	U("kau", "Khulna Agricultural University", "KAU", "agricultural", "Khulna", "https://www.kau.edu.bd", { directoryNote: "No 2026–27 notice is stored here." }),
	U("hau", "Hobiganj Agricultural University", "HAU", "agricultural", "Hobiganj", "https://www.hau.ac.bd", { directoryNote: "Spelling follows the UGC public list (Hobiganj). No 2026–27 notice is stored here." }),
	U("kurau", "Kurigram Agricultural University", "KurAU", "agricultural", "Kurigram", "https://www.kuriau.edu.bd", { directoryNote: "No 2026–27 notice is stored here." }),
	U("shau", "Shariatpur Agricultural University", "ShAU", "agricultural", "Shariatpur", null, { directoryNote: "UGC's public list does not publish a website. No 2026–27 notice is stored here." }),
	U("cvasu", "Chittagong Veterinary and Animal Sciences University", "CVASU", "agricultural", "Chattogram", "https://www.cvasu.ac.bd", { directoryNote: "No 2026–27 notice is stored here." }),
	U("bmu-med", "Bangladesh Medical University", "BMU", "medical", "Dhaka", "https://www.bmu.ac.bd", { directoryNote: MEDICAL_UNI + " Not Bangladesh Maritime University." }),
	U("cmu", "Chittagong Medical University", "CMU", "medical", "Chattogram", "https://www.cmu.edu.bd", { directoryNote: MEDICAL_UNI }),
	U("rmu", "Rajshahi Medical University", "RMU", "medical", "Rajshahi", "https://www.rmu.ac.bd", { directoryNote: MEDICAL_UNI }),
	U("smu", "Sylhet Medical University", "SMU", "medical", "Sylhet", "https://www.bsfmmu.edu.bd", { directoryNote: MEDICAL_UNI + " UGC's list still publishes the pre-rename host bsfmmu.edu.bd." }),
	U("kmu", "Khulna Medical University", "KMU", "medical", "Khulna", "https://www.shmu.ac.bd", { directoryNote: MEDICAL_UNI + " UGC's list still publishes the pre-rename host shmu.ac.bd." }),
	U("bup", "Bangladesh University of Professionals", "BUP", "specialized", "Dhaka", "https://www.bup.edu.bd", { directoryNote: "Runs its own undergraduate admission. No 2026–27 notice is stored here." }),
	U("mist", "Military Institute of Science and Technology", "MIST", "specialized", "Dhaka", "https://mist.ac.bd", {
		nameBn: "মিলিটারি ইনস্টিটিউট অব সায়েন্স অ্যান্ড টেকনোলজি",
		tags: ["engineering"],
		directoryNote: "Undergraduate notice for 2026–27 was cited by The Daily Star. Application dates were not in that report."
	}),
	U("butex", "Bangladesh University of Textiles", "BUTEX", "specialized", "Dhaka", "https://www.butex.edu.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("maru", "Bangladesh Maritime University", "MarU", "specialized", "Dhaka", "https://bmu.edu.bd", { directoryNote: "Not Bangladesh Medical University (bmu.ac.bd). No 2026–27 notice is stored here." }),
	U("aaub", "Aviation and Aerospace University, Bangladesh", "AAUB", "specialized", "Lalmonirhat", "https://www.aaub.edu.bd", { directoryNote: "No 2026–27 notice is stored in this archive." }),
	U("iut", "Islamic University of Technology", "IUT", "specialized", "Gazipur", "https://www.iutoic-dhaka.edu", {
		tags: ["engineering"],
		directoryNote: "International (OIC) university at Board Bazar. Not a UGC private university. No 2026–27 notice is stored here."
	}),
	U("nu", "National University", "NU", "national", "Gazipur", "https://www.nu.edu.bd", { directoryNote: "Admits students to affiliated colleges under its own system. Not a GST university. No 2026–27 notice is stored here." }),
	U("bou", "Bangladesh Open University", "BOU", "national", "Gazipur", "https://www.bou.ac.bd", { directoryNote: "Open-admission programmes, separate from campus university tests. No 2026–27 notice is stored here." }),
	U("iau", "Islamic Arabic University", "IAU", "national", "Dhaka", "https://www.iau.edu.bd", { directoryNote: "Admits through affiliated madrasas. No 2026–27 notice is stored here." }),
	U("nsu", "North South University", "NSU", "private", "Dhaka", "https://www.northsouth.edu", { directoryNote: "Private university. Semester intake. No 2026–27 circular is stored here." }),
	U("bracu", "BRAC University", "BRACU", "private", "Dhaka", "https://www.bracu.ac.bd", { directoryNote: "Private university. Semester intake. No 2026–27 circular is stored here." }),
	U("iub", "Independent University, Bangladesh", "IUB", "private", "Dhaka", "https://www.iub.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("aust", "Ahsanullah University of Science and Technology", "AUST", "private", "Dhaka", "https://www.aust.edu", {
		tags: ["engineering"],
		directoryNote: "Private engineering-focused university. No 2026–27 circular is stored here."
	}),
	U("aiub", "American International University-Bangladesh", "AIUB", "private", "Dhaka", "https://www.aiub.edu", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("ewu", "East West University", "EWU", "private", "Dhaka", "https://www.ewubd.edu", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("uiu", "United International University", "UIU", "private", "Dhaka", "https://www.uiu.ac.bd", {
		tags: ["engineering"],
		directoryNote: "Private university. No 2026–27 circular is stored here."
	}),
	U("diu", "Daffodil International University", "DIU", "private", "Dhaka", "https://daffodilvarsity.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("uap", "University of Asia Pacific", "UAP", "private", "Dhaka", "https://www.uap-bd.edu", {
		tags: ["engineering"],
		directoryNote: "Private university. No 2026–27 circular is stored here."
	}),
	U("ulab", "University of Liberal Arts Bangladesh", "ULAB", "private", "Dhaka", "https://ulab.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("iubat", "International University of Business Agriculture and Technology", "IUBAT", "private", "Dhaka", "https://www.iubat.edu", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("bubt", "Bangladesh University of Business and Technology", "BUBT", "private", "Dhaka", "https://www.bubt.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("green", "Green University of Bangladesh", "GUB", "private", "Dhaka", "https://green.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("seu", "Southeast University", "SEU", "private", "Dhaka", "https://www.seu.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("iiuc", "International Islamic University Chittagong", "IIUC", "private", "Chattogram", "https://www.iiuc.ac.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("uits", "University of Information Technology and Sciences", "UITS", "private", "Dhaka", "https://www.uits.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("puc", "Premier University", "PUC", "private", "Chattogram", "https://www.puc.ac.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("lus", "Leading University", "LUS", "private", "Sylhet", "https://www.lus.ac.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("eastern", "Eastern University", "EU", "private", "Dhaka", "https://www.easternuni.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." }),
	U("baust", "Bangladesh Army University of Science and Technology", "BAUST", "private", "Saidpur", "https://www.baust.edu.bd", {
		tags: ["engineering"],
		directoryNote: "Private university. No 2026–27 circular is stored here."
	}),
	U("stamford", "Stamford University Bangladesh", "SUB", "private", "Dhaka", "https://www.stamforduniversity.edu.bd", { directoryNote: "Private university. No 2026–27 circular is stored here." })
];
var seedSystems = [
	{
		id: "gst",
		kind: "system",
		name: "GST Cluster — General, Science and Technology",
		shortName: "GST",
		nameBn: "জিএসটি গুচ্ছ",
		track: "system",
		tags: ["gst"],
		city: "National",
		website: null,
		admissionUrl: null,
		directoryNote: "The Daily Star (4 Nov 2026) reported a 20-university cluster with tests on 19, 20 and 27 March 2027. Application dates were not announced. The twenty members were not named. This archive does not guess membership."
	},
	{
		id: "agri",
		kind: "system",
		name: "Agricultural Cluster — nine universities",
		shortName: "AGRI",
		nameBn: "কৃষি গুচ্ছ",
		track: "system",
		tags: ["agricultural"],
		city: "National",
		website: "https://www.sau.edu.bd",
		admissionUrl: null,
		directoryNote: "Coordinated this year by Sher-e-Bangla Agricultural University, according to The Daily Star (4 Nov 2026). Combined test 2 Jan 2027. Application arrangements and the nine members were not announced."
	},
	{
		id: "dghs",
		kind: "system",
		name: "Medical and Dental Admission — DGHS",
		shortName: "DGHS",
		nameBn: "এমবিবিএস ও বিডিএস",
		track: "system",
		tags: ["medical"],
		city: "National",
		website: "https://www.dghs.gov.bd",
		admissionUrl: null,
		directoryNote: "Central admission for government medical and dental colleges. The Daily Star (4 Nov 2026) called the test date tentative. This is not the postgraduate admission of Bangladesh Medical University."
	}
];
var MONTHS = [
	"JAN",
	"FEB",
	"MAR",
	"APR",
	"MAY",
	"JUN",
	"JUL",
	"AUG",
	"SEP",
	"OCT",
	"NOV",
	"DEC"
];
function parseDay(iso) {
	const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
	return new Date(y, (m ?? 1) - 1, d ?? 1);
}
function formatDay(iso) {
	if (!iso) return "NOT ANNOUNCED";
	const dt = parseDay(iso);
	return `${String(dt.getDate()).padStart(2, "0")} ${MONTHS[dt.getMonth()]} ${dt.getFullYear()}`;
}
function formatDayTime(day, time) {
	const base = formatDay(day);
	if (!day) return base;
	return time ? `${base} · ${time}` : base;
}
function todayISO(now = /* @__PURE__ */ new Date()) {
	return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}
function daysUntil(day, now = /* @__PURE__ */ new Date()) {
	const target = parseDay(day).getTime();
	const today = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
	return Math.round((target - today) / 864e5);
}
function relativeDay(day, now = /* @__PURE__ */ new Date()) {
	const n = daysUntil(day, now);
	if (n === 0) return "TODAY";
	if (n === 1) return "TOMORROW";
	if (n === -1) return "YESTERDAY";
	if (n > 1) return `IN ${n} DAYS`;
	return `${Math.abs(n)} DAYS AGO`;
}
function atInstant(day, time, bound) {
	if (!day) return null;
	const dt = parseDay(day);
	if (time && /^\d{2}:\d{2}$/.test(time)) {
		const [h, min] = time.split(":").map(Number);
		dt.setHours(h ?? 0, min ?? 0, 0, 0);
		return dt;
	}
	if (bound === "end") dt.setHours(23, 59, 59, 999);
	else dt.setHours(0, 0, 0, 0);
	return dt;
}
var emptyPersonal = {
	version: 1,
	bookmarks: [],
	shortlist: [],
	readIds: [],
	pinnedIds: [],
	verifiedOn: {},
	progress: {},
	notes: {},
	universityPatches: {},
	circularPatches: {},
	customUniversities: [],
	customCirculars: [],
	hiddenUniversityIds: [],
	hiddenCircularIds: []
};
function toggle(list, id) {
	return list.includes(id) ? list.filter((item) => item !== id) : [...list, id];
}
var memoryStore = /* @__PURE__ */ new Map();
var browserStorage = {
	getItem: (name) => {
		if (typeof window === "undefined") return memoryStore.get(name) ?? null;
		return localStorage.getItem(name);
	},
	setItem: (name, value) => {
		if (typeof window === "undefined") memoryStore.set(name, value);
		else localStorage.setItem(name, value);
	},
	removeItem: (name) => {
		if (typeof window === "undefined") memoryStore.delete(name);
		else localStorage.removeItem(name);
	}
};
var usePersonal = create()(persist((set, get) => ({
	...emptyPersonal,
	hydrated: false,
	setHydrated: (value) => set({ hydrated: value }),
	toggleBookmark: (id) => set({ bookmarks: toggle(get().bookmarks, id) }),
	toggleShortlist: (id) => set({ shortlist: toggle(get().shortlist, id) }),
	toggleRead: (id) => set({ readIds: toggle(get().readIds, id) }),
	markRead: (id) => set({ readIds: get().readIds.includes(id) ? get().readIds : [...get().readIds, id] }),
	togglePin: (id) => set({ pinnedIds: toggle(get().pinnedIds, id) }),
	toggleVerified: (id) => {
		const next = { ...get().verifiedOn };
		if (next[id]) delete next[id];
		else next[id] = todayISO();
		set({ verifiedOn: next });
	},
	setProgress: (id, progress) => {
		const next = { ...get().progress };
		if (!progress) delete next[id];
		else next[id] = progress;
		set({ progress: next });
	},
	setNote: (id, note) => {
		const next = { ...get().notes };
		if (!note.trim()) delete next[id];
		else next[id] = note;
		set({ notes: next });
	},
	saveUniversity: (id, patch, custom) => {
		if (custom) {
			set({ customUniversities: get().customUniversities.map((item) => item.id === id ? {
				...item,
				...patch,
				id
			} : item) });
			return;
		}
		set({ universityPatches: {
			...get().universityPatches,
			[id]: {
				...get().universityPatches[id],
				...patch,
				id
			}
		} });
	},
	saveCircular: (id, patch, custom) => {
		if (custom) {
			set({ customCirculars: get().customCirculars.map((item) => item.id === id ? {
				...item,
				...patch,
				id
			} : item) });
			return;
		}
		set({ circularPatches: {
			...get().circularPatches,
			[id]: {
				...get().circularPatches[id],
				...patch,
				id
			}
		} });
	},
	addUniversity: (university) => set({ customUniversities: [...get().customUniversities, university] }),
	addCircular: (circular) => set({ customCirculars: [...get().customCirculars, circular] }),
	hideUniversity: (id) => {
		if (get().customUniversities.some((item) => item.id === id)) {
			set({ customUniversities: get().customUniversities.filter((item) => item.id !== id) });
			return;
		}
		set({ hiddenUniversityIds: [.../* @__PURE__ */ new Set([...get().hiddenUniversityIds, id])] });
	},
	hideCircular: (id) => {
		if (get().customCirculars.some((item) => item.id === id)) {
			set({ customCirculars: get().customCirculars.filter((item) => item.id !== id) });
			return;
		}
		set({ hiddenCircularIds: [.../* @__PURE__ */ new Set([...get().hiddenCircularIds, id])] });
	},
	replacePersonal: (data) => set({
		...emptyPersonal,
		...data,
		version: 1
	}),
	resetPersonal: () => set({ ...emptyPersonal })
}), {
	name: "admission26.v1",
	storage: createJSONStorage(() => browserStorage),
	skipHydration: true,
	partialize: (state) => ({
		version: state.version,
		bookmarks: state.bookmarks,
		shortlist: state.shortlist,
		readIds: state.readIds,
		pinnedIds: state.pinnedIds,
		verifiedOn: state.verifiedOn,
		progress: state.progress,
		notes: state.notes,
		universityPatches: state.universityPatches,
		circularPatches: state.circularPatches,
		customUniversities: state.customUniversities,
		customCirculars: state.customCirculars,
		hiddenUniversityIds: state.hiddenUniversityIds,
		hiddenCircularIds: state.hiddenCircularIds
	})
}));
function personalSnapshot(state) {
	return {
		version: 1,
		bookmarks: state.bookmarks,
		shortlist: state.shortlist,
		readIds: state.readIds,
		pinnedIds: state.pinnedIds,
		verifiedOn: state.verifiedOn,
		progress: state.progress,
		notes: state.notes,
		universityPatches: state.universityPatches,
		circularPatches: state.circularPatches,
		customUniversities: state.customUniversities,
		customCirculars: state.customCirculars,
		hiddenUniversityIds: state.hiddenUniversityIds,
		hiddenCircularIds: state.hiddenCircularIds
	};
}
function parseBackup(raw) {
	if (!raw || typeof raw !== "object") return null;
	const record = raw;
	if (record.archive !== "ADMISSION//26" || record.version !== 1) return null;
	const personal = record.personal;
	if (!personal || typeof personal !== "object") return null;
	const data = personal;
	if (!Array.isArray(data.bookmarks) || !Array.isArray(data.customUniversities) || !Array.isArray(data.customCirculars)) return null;
	return {
		...emptyPersonal,
		...data,
		version: 1
	};
}
function mergeUni(base, patch) {
	if (!patch) return base;
	return {
		...base,
		...patch,
		id: base.id,
		kind: patch.kind ?? base.kind
	};
}
function mergeCircular(base, patch) {
	if (!patch) return base;
	return {
		...base,
		...patch,
		id: base.id
	};
}
function buildCatalog(input) {
	const hiddenU = new Set(input.hiddenUniversityIds);
	const hiddenC = new Set(input.hiddenCircularIds);
	const universities = [
		...seedUniversities,
		...seedSystems,
		...input.customUniversities
	].filter((item) => !hiddenU.has(item.id)).map((item) => mergeUni(item, input.universityPatches[item.id]));
	return {
		universities,
		circulars: [...seedCirculars, ...input.customCirculars].filter((item) => !hiddenC.has(item.id)).map((item) => mergeCircular(item, input.circularPatches[item.id])).filter((item) => universities.some((uni) => uni.id === item.universityId)),
		byId: new Map(universities.map((uni) => [uni.id, uni]))
	};
}
function useCatalog() {
	const customUniversities = usePersonal((s) => s.customUniversities);
	const customCirculars = usePersonal((s) => s.customCirculars);
	const universityPatches = usePersonal((s) => s.universityPatches);
	const circularPatches = usePersonal((s) => s.circularPatches);
	const hiddenUniversityIds = usePersonal((s) => s.hiddenUniversityIds);
	const hiddenCircularIds = usePersonal((s) => s.hiddenCircularIds);
	return (0, import_react.useMemo)(() => buildCatalog({
		customUniversities,
		customCirculars,
		universityPatches,
		circularPatches,
		hiddenUniversityIds,
		hiddenCircularIds
	}), [
		customUniversities,
		customCirculars,
		universityPatches,
		circularPatches,
		hiddenUniversityIds,
		hiddenCircularIds
	]);
}
function isCustomUniversity(id) {
	return usePersonal.getState().customUniversities.some((item) => item.id === id);
}
function isCustomCircular(id) {
	return usePersonal.getState().customCirculars.some((item) => item.id === id);
}
function blankUniversity(name) {
	return {
		id: `u-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "").slice(0, 24) || "record"}-${Date.now().toString(36)}`,
		kind: "university",
		name: name.trim() || "Untitled university",
		shortName: "NEW",
		nameBn: "",
		track: "general",
		tags: [],
		city: "",
		website: null,
		admissionUrl: null,
		directoryNote: "Added on this desk. No official 2026–27 notice is stored until you log a source."
	};
}
function blankCircular(universityId, title) {
	return {
		id: `c-${universityId}-${Date.now().toString(36)}`,
		universityId,
		session: "2026-27",
		title: title.trim() || "Untitled notice",
		summary: "Logged on this desk. Fill only facts you have checked.",
		system: "own",
		publication: "none",
		confidence: "not-announced",
		confidenceNote: "Entered locally. Not yet tied to a source.",
		sources: [],
		updatedOn: (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		pdfUrl: null,
		applicationOpens: null,
		opensAt: null,
		applicationCloses: null,
		closesAt: null,
		admitCardOn: null,
		examDate: null,
		examTime: null,
		resultOn: null,
		classesBegin: null,
		feeBdt: null,
		feeNote: "",
		seats: null,
		eligibility: [],
		units: [],
		notes: []
	};
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var NAV = [
	{
		href: "/",
		label: "Overview"
	},
	{
		href: "/universities",
		label: "All universities"
	},
	{
		href: "/circulars",
		label: "Circular archive"
	},
	{
		href: "/radar",
		label: "Deadline radar"
	},
	{
		href: "/shortlist",
		label: "My shortlist"
	},
	{
		href: "/tracker",
		label: "Application tracker"
	},
	{
		href: "/settings",
		label: "Settings"
	}
];
function active(path, href) {
	if (href === "/") return path === "/";
	return path === href || path.startsWith(`${href}/`);
}
function Shell({ children }) {
	const path = useRouterState({ select: (s) => s.location.pathname });
	const shortlist = usePersonal((s) => s.shortlist.length);
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [query, setQuery] = (0, import_react.useState)("");
	const [searchOpen, setSearchOpen] = (0, import_react.useState)(false);
	const inputRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	const { universities, circulars } = useCatalog();
	(0, import_react.useEffect)(() => {
		Promise.resolve(usePersonal.persist.rehydrate()).finally(() => {
			usePersonal.getState().setHydrated(true);
		});
	}, []);
	(0, import_react.useEffect)(() => {
		setMenu(false);
		setSearchOpen(false);
		setQuery("");
	}, [path]);
	(0, import_react.useEffect)(() => {
		const onKey = (event) => {
			const tag = event.target?.tagName;
			const typing = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT";
			if (event.key === "/" && !typing || (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
				event.preventDefault();
				inputRef.current?.focus();
				setSearchOpen(true);
			}
			if (event.key === "Escape") {
				setSearchOpen(false);
				setMenu(false);
			}
		};
		window.addEventListener("keydown", onKey);
		return () => window.removeEventListener("keydown", onKey);
	}, []);
	const results = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		if (q.length < 1) return {
			universities: [],
			circulars: []
		};
		return {
			universities: universities.filter((uni) => [
				uni.name,
				uni.shortName,
				uni.nameBn,
				uni.city,
				uni.id
			].join(" ").toLowerCase().includes(q)).slice(0, 6),
			circulars: circulars.filter((item) => item.title.toLowerCase().includes(q) || item.summary.toLowerCase().includes(q)).slice(0, 6)
		};
	}, [
		query,
		universities,
		circulars
	]);
	const go = (to) => {
		setSearchOpen(false);
		setQuery("");
		navigate({ to });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "md:grid md:grid-cols-[232px_minmax(0,1fr)]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "sticky top-0 hidden h-screen flex-col border-r border-ink bg-ink text-paper md:flex",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
						path,
						shortlist
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-auto border-t border-paper/30 p-4 font-mono text-xs leading-relaxed text-paper/70",
						children: [
							"SESSION 2026–27",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"LOCAL DESK",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
							"NOT A UNIVERSITY PORTAL"
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
						className: "sticky top-0 z-30 border-b border-ink bg-paper",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3 px-4 py-3 md:px-8",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									className: "h-11 border border-ink px-3 font-display text-sm font-semibold uppercase tracking-widest md:hidden",
									onClick: () => setMenu(true),
									children: "Menu"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative min-w-0 flex-1",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "sr-only",
											htmlFor: "archive-search",
											children: "Search the archive"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											id: "archive-search",
											ref: inputRef,
											value: query,
											placeholder: "SEARCH THE ARCHIVE",
											suppressHydrationWarning: true,
											className: "h-11 w-full border border-ink bg-paper px-3 font-mono text-xs uppercase tracking-widest outline-none placeholder:text-mute focus:bg-panel",
											onChange: (event) => {
												setQuery(event.target.value);
												setSearchOpen(true);
											},
											onFocus: () => setSearchOpen(true),
											onKeyDown: (event) => {
												if (event.key === "Enter") {
													const uni = results.universities[0];
													const circular = results.circulars[0];
													if (uni) go(`/universities/${uni.id}`);
													else if (circular) go(`/circulars/${circular.id}`);
												}
											}
										}),
										searchOpen && query.trim() ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "absolute top-full right-0 left-0 z-40 mt-1 max-h-[70vh] overflow-auto border border-ink bg-paper",
											children: [
												results.universities.length + results.circulars.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "px-3 py-4 font-mono text-xs text-mute",
													children: "NO MATCH IN THE DIRECTORY"
												}) : null,
												results.universities.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "border-b border-ink px-3 py-2 font-mono text-xs tracking-widest text-mute",
													children: "UNIVERSITIES"
												}) : null,
												results.universities.map((uni) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
													type: "button",
													className: "flex w-full items-baseline gap-3 border-b border-ink px-3 py-3 text-left hover:bg-panel",
													onClick: () => go(`/universities/${uni.id}`),
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "font-display text-2xl font-bold uppercase",
														children: uni.shortName
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-sm",
														children: uni.name
													})]
												}, uni.id)),
												results.circulars.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "border-b border-ink px-3 py-2 font-mono text-xs tracking-widest text-mute",
													children: "CIRCULARS"
												}) : null,
												results.circulars.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													className: "block w-full border-b border-ink px-3 py-3 text-left text-sm hover:bg-panel",
													onClick: () => go(`/circulars/${item.id}`),
													children: item.title
												}, item.id))
											]
										}) : null
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "hidden font-mono text-xs tracking-widest text-mute sm:block",
									children: "SESSION 2026–27"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
						className: "px-4 py-6 md:px-8 md:py-8",
						children
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
						className: "border-t border-ink px-4 py-4 font-mono text-xs leading-relaxed text-mute md:px-8",
						children: "ADMISSION//26 · THE BANGLADESH UNIVERSITY ADMISSION ARCHIVE · LOCAL DESK · VERIFY EVERY DATE AGAINST THE CITED SOURCE · NOT ANNOUNCED MEANS THIS ARCHIVE DOES NOT HAVE IT"
					})
				]
			})]
		}), menu ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "fixed inset-0 z-50 flex flex-col bg-ink text-paper md:hidden",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b border-paper/30 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Brand, { compact: true }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "h-11 border border-paper px-3 font-display text-sm uppercase tracking-widest",
					onClick: () => setMenu(false),
					children: "Close"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Nav, {
				path,
				shortlist,
				onNavigate: () => setMenu(false)
			})]
		}) : null]
	});
}
function Brand({ compact = false }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/",
		className: cn("block px-4 py-5", compact && "px-0 py-0"),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "font-display text-4xl font-bold uppercase leading-none tracking-tight",
			children: [
				"A",
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-accent",
					children: "//"
				}),
				"26"
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mt-1 block font-mono text-xs tracking-widest text-paper/70",
			children: "ADMISSION ARCHIVE"
		})]
	});
}
function Nav({ path, shortlist, onNavigate }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "flex flex-col",
		children: NAV.map((item) => {
			const on = active(path, item.href);
			return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: item.href,
				onClick: onNavigate,
				"aria-current": on ? "page" : void 0,
				className: cn("flex h-12 items-center justify-between border-l-4 px-4 font-display text-lg font-semibold uppercase tracking-wide", on ? "border-accent bg-paper text-ink" : "border-transparent text-paper hover:bg-paper/10"),
				children: [item.label, item.href === "/shortlist" && shortlist > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-mono text-xs",
					children: String(shortlist).padStart(2, "0")
				}) : null]
			}, item.href);
		})
	});
}
var styles_default = "/assets/styles-CMVeGLCZ.css";
var Route$9 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "ADMISSION//26" },
			{
				name: "description",
				content: "The Bangladesh university admission archive for the 2026–27 session."
			},
			{
				name: "theme-color",
				content: "#111111"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@500;600;700;800&family=IBM+Plex+Mono:wght@400;500;600&family=Source+Sans+3:ital,wght@0,400;0,600;0,700;1,400&display=swap"
			}
		]
	}),
	component: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Shell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	}),
	notFoundComponent: () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "border border-ink p-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs tracking-widest text-mute",
				children: "404"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-2 font-display text-5xl font-bold uppercase",
				children: "Not in the archive"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: "/",
				className: "mt-4 inline-block font-mono text-sm underline",
				children: "Return to overview"
			})
		]
	})
});
var $$splitComponentImporter$8 = () => import("./routes-1npC0VxA.mjs");
var Route$8 = createFileRoute("/")({
	head: () => ({ meta: [{ title: "Overview — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$8, "component")
});
var $$splitComponentImporter$7 = () => import("./radar-B_QC2klP.mjs");
var Route$7 = createFileRoute("/radar")({
	head: () => ({ meta: [{ title: "Deadline radar — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$7, "component")
});
var $$splitComponentImporter$6 = () => import("./settings--LuVQfWr.mjs");
var Route$6 = createFileRoute("/settings")({
	head: () => ({ meta: [{ title: "Settings — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$6, "component")
});
var $$splitComponentImporter$5 = () => import("./shortlist-DImUuMLP.mjs");
var Route$5 = createFileRoute("/shortlist")({
	head: () => ({ meta: [{ title: "My shortlist — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$5, "component")
});
var $$splitComponentImporter$4 = () => import("./tracker-BeurJtGz.mjs");
var Route$4 = createFileRoute("/tracker")({
	head: () => ({ meta: [{ title: "Application tracker — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$4, "component")
});
var $$splitComponentImporter$3 = () => import("./circulars-CxV-QlKm.mjs");
var Route$3 = createFileRoute("/circulars/")({
	head: () => ({ meta: [{ title: "Circular archive — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$3, "component")
});
var $$splitComponentImporter$2 = () => import("../_id-BrNaD7ho.mjs");
var Route$2 = createFileRoute("/circulars/$id")({
	head: () => ({ meta: [{ title: "Circular — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$2, "component")
});
var $$splitComponentImporter$1 = () => import("./universities-DFe-tRd3.mjs");
var Route$1 = createFileRoute("/universities/")({
	head: () => ({ meta: [{ title: "All universities — ADMISSION//26" }] }),
	component: lazyRouteComponent($$splitComponentImporter$1, "component")
});
var $$splitComponentImporter = () => import("../_id-Dekvy6hT.mjs");
var Route = createFileRoute("/universities/$id")({
	head: ({ params }) => ({ meta: [{ title: `${params.id.toUpperCase()} — ADMISSION//26` }] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var IndexRoute = Route$8.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$9
});
var RadarRoute = Route$7.update({
	id: "/radar",
	path: "/radar",
	getParentRoute: () => Route$9
});
var SettingsRoute = Route$6.update({
	id: "/settings",
	path: "/settings",
	getParentRoute: () => Route$9
});
var ShortlistRoute = Route$5.update({
	id: "/shortlist",
	path: "/shortlist",
	getParentRoute: () => Route$9
});
var TrackerRoute = Route$4.update({
	id: "/tracker",
	path: "/tracker",
	getParentRoute: () => Route$9
});
var CircularsIndexRoute = Route$3.update({
	id: "/circulars/",
	path: "/circulars/",
	getParentRoute: () => Route$9
});
var CircularsIdRoute = Route$2.update({
	id: "/circulars/$id",
	path: "/circulars/$id",
	getParentRoute: () => Route$9
});
var UniversitiesIndexRoute = Route$1.update({
	id: "/universities/",
	path: "/universities/",
	getParentRoute: () => Route$9
});
var rootRouteChildren = {
	IndexRoute,
	RadarRoute,
	SettingsRoute,
	ShortlistRoute,
	TrackerRoute,
	CircularsIdRoute,
	UniversitiesIdRoute: Route.update({
		id: "/universities/$id",
		path: "/universities/$id",
		getParentRoute: () => Route$9
	}),
	CircularsIndexRoute,
	UniversitiesIndexRoute
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		rewrite: previewPathRewrite(),
		defaultErrorComponent: AppErrorComponent
	});
}
//#endregion
export { formatDayTime as _, blankCircular as a, EVIDENCE_COPY as b, isCustomCircular as c, parseBackup as d, personalSnapshot as f, formatDay as g, daysUntil as h, cn as i, isCustomUniversity as l, atInstant as m, Route as n, blankUniversity as o, usePersonal as p, Route$2 as r, buildCatalog as s, router_exports as t, useCatalog as u, relativeDay as v, todayISO as y };
