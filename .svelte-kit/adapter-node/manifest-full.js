export const manifest = (() => {
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
		client: {start:"_app/immutable/entry/start.7-JbjRAR.js",app:"_app/immutable/entry/app.C7lJf8N3.js",imports:["_app/immutable/entry/start.7-JbjRAR.js","_app/immutable/chunks/D7HISDIr.js","_app/immutable/chunks/BNRMaQ6w.js","_app/immutable/chunks/C6_Di0yv.js","_app/immutable/entry/app.C7lJf8N3.js","_app/immutable/chunks/BNRMaQ6w.js","_app/immutable/chunks/d8qabzM9.js","_app/immutable/chunks/BGNoLB_1.js","_app/immutable/chunks/C6_Di0yv.js"],stylesheets:[],fonts:[],uses_env_dynamic_public:false},
		nodes: [
			__memo(() => import('./nodes/0.js')),
			__memo(() => import('./nodes/1.js')),
			__memo(() => import('./nodes/2.js'))
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
