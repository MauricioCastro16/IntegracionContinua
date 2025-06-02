

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.X89oDbgX.js","_app/immutable/chunks/BGNoLB_1.js","_app/immutable/chunks/BNRMaQ6w.js"];
export const stylesheets = ["_app/immutable/assets/0.b0CfVk16.css"];
export const fonts = [];
