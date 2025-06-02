const manifest = (() => {
function __memo(fn) {
	let value;
	return () => value ??= (value = fn());
}

return {
	appDir: "_app",
	appPath: "_app",
	assets: new Set(["favicon.png"]),
	mimeTypes: {".png":"image/png"},
	_: {
		client: {start:"_app/immutable/entry/start.C3vwDF-9.js",app:"_app/immutable/entry/app.C3TCm3I_.js",imports:["_app/immutable/entry/start.C3vwDF-9.js","_app/immutable/chunks/DV8KPn8A.js","_app/immutable/chunks/BNRMaQ6w.js","_app/immutable/chunks/C6_Di0yv.js","_app/immutable/entry/app.C3TCm3I_.js","_app/immutable/chunks/BNRMaQ6w.js","_app/immutable/chunks/d8qabzM9.js","_app/immutable/chunks/BGNoLB_1.js","_app/immutable/chunks/C6_Di0yv.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./chunks/0-CIAbfpoz.js')),
			__memo(() => import('./chunks/1-_o60-7cz.js')),
			__memo(() => import('./chunks/2-CO5Jid1P.js'))
		],
		routes: [
			{
				id: "/",
				pattern: /^\/$/,
				params: [],
				page: { layouts: [0,], errors: [1,], leaf: 2 },
				endpoint: null
			}
		],
		prerendered_routes: new Set([]),
		matchers: async () => {
			
			return {  };
		},
		server_assets: {}
	}
}
})();

const prerendered = new Set([]);

const base = "";

export { base, manifest, prerendered };
//# sourceMappingURL=manifest.js.map
