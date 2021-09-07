"use restrict";

import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter, plugins } from "webix-jet";
import session from "models/session";

export default class App extends JetApp {
	constructor(config) {
		const defaults = {
			id: APPNAME,
			version: VERSION,
			router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
			debug: !PRODUCTION,
			start: "/Main"
		};

		super({ ...defaults, ...config });

		this.use(plugins.User, {
			model: session,
			ping: null
		});
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		let app = new App();
		app.render();
	});
}