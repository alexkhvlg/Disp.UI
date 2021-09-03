"use restrict";

import "./styles/app.css";
import { JetApp, EmptyRouter, HashRouter } from "webix-jet";
import Controller from "Controller";

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
	}
}

if (!BUILD_AS_MODULE) {
	webix.ready(() => {
		let app = new App();
		Controller.AddApp(app);
		app.render();
	});
}