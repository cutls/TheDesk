function css(mainWindow) {
	const electron = require("electron");
	const fs = require("fs");
	const path = require('path')
	var ipc = electron.ipcMain;
	var JSON5 = require('json5');
	const app = electron.app;
	const join = require('path').join;
	var customcss = join(app.getPath("userData"), "custom.css");

	ipc.on('custom-css-create', function (e, arg) {
		fs.writeFileSync(customcss, arg);
		e.sender.send('custom-css-create-complete', "");
	})
	ipc.on('custom-css-request', function (e, arg) {
		try {
			var css = fs.readFileSync(customcss, 'utf8');
		} catch (e) {
			var css = "";
		}
		e.sender.send('custom-css-response', css);
	})
	ipc.on('theme-json-create', function (e, arg) {
		var themecss = join(app.getPath("userData"), JSON5.parse(arg)["id"] +
			".thedesktheme");
		fs.writeFileSync(themecss, JSON5.stringify(JSON5.parse(arg)));
		if (JSON5.parse(arg)["id"]) {
			e.sender.send('theme-json-create-complete', "");
		} else {
			e.sender.send('theme-json-create-complete', "error");
		}
	})
	ipc.on('theme-json-delete', function (e, arg) {
		try {
			var themecss = join(app.getPath("userData"), arg);
			console.log(themecss);
			fs.unlink(themecss, function (err) {
				e.sender.send('theme-json-delete-complete', "");
			});
		} catch {
			e.sender.send('theme-json-delete-complete', 'cannot delete');
		}

	})
	ipc.on('theme-json-request', function (e, arg) {
		try {
			var themecss = join(app.getAppPath(), '/source/themes', arg)
			var raw = fs.readFileSync(themecss, 'utf8')
			var json = JSON5.parse(raw)
		} catch {
			var themecss = join(app.getPath("userData"), arg)
			var raw = fs.readFileSync(themecss, 'utf8')
			var json = JSON5.parse(raw)
		}
		e.sender.send('theme-json-response', [json, raw]);
	})
	ipc.on('theme-css-request', function (e, args) {
		if (args[0] === 'themeCSSPreview') {
			var json = args[1]
		} else {
			try {
				var themecss = join(app.getAppPath(), '/source/themes', args[1])
				var json = JSON5.parse(fs.readFileSync(themecss, 'utf8'))
			} catch {
				var themecss = join(app.getPath("userData"), args[1])
				var json = JSON5.parse(fs.readFileSync(themecss, 'utf8'))
			}
		}

		try {
			var css
			if (json.version) {
				var bg = json.primary.background
				var subcolor = json.primary.subcolor
				var text = json.primary.text
				var accent = json.primary.accent
				if (json.base == "light") {
					var drag = "rgba(255, 255, 255, 0.8)";
					var beforehover = "#757575";
					var selected = "#3f3f3f"
					var selectedWithShare = "#b2babd"
					var gray = "#757575"
					var hisData = 'rgba(255, 255, 255, 0.9)'
				} else {
					var drag = "rgba(0, 0, 0, 0.8)";
					var beforehover = "#9e9e9e";
					var selected = "#c0c0c0"
					var selectedWithShare = "#003a30"
					var gray = "#cccccc"
					var hisData = 'rgba(0, 0, 0, 0.8)'
				}
				if (!json.advanced) {
					json.advanced = {}
				}
				if (json.advanced.modal) {
					var modal = json.advanced.modal
				} else {
					var modal = bg
				}
				if (json.advanced.modalFooter) {
					var modalFooter = json.advanced.modalFooter
				} else {
					var modalFooter = bg
					if (modal != bg) modalFooter = modal
				}
				if (json.advanced.thirdColor) {
					var thirdColor = json.advanced.thirdColor
				} else {
					var thirdColor = subcolor
				}
				if (json.advanced.forthColor) {
					var forthColor = json.advanced.forthColor
				} else {
					var forthColor = subcolor
					if (thirdColor != subcolor) forthColor = thirdColor
				}
				if (json.advanced.bottom) {
					var bottom = json.advanced.bottom
				} else {
					var bottom = subcolor
				}
				if (json.advanced.emphasized) {
					var emphasized = json.advanced.emphasized
				} else {
					var emphasized = accent
				}
				if (json.advanced.postbox) {
					var postbox = json.advanced.postbox
				} else {
					var postbox = subcolor
				}
				if (json.advanced.active) {
					var active = json.advanced.active
				} else {
					var active = accent
				}
				if (json.advanced.selected) {
					var selected = json.advanced.selected
				}
				if (json.advanced.selectedWithShare) {
					var selectedWithShare = json.advanced.selectedWithShare
				}

				var css = ":root {--bg:" + bg + ";--drag:" + drag + ";" +
					"--text:" + text + ";--beforehover:" + beforehover + ";--modal:" +
					modal + ";--thirdColor:" + thirdColor + ";--subcolor:" + forthColor +
					";--bottom:" + bottom + ";--accent:" + accent + ";" + ";--emphasized:" + emphasized + ";--his-data:" +
					hisData +
					";--active:" + active + ";--postbox:" + postbox + ";--modalfooter:" +
					modalFooter + ";--selected:" + selected + ";--selectedWithShare:" + selectedWithShare +
					";--gray:" + gray + ";}" +
					".customtheme #imagemodal{background: url(\"../img/pixel.svg\");}";
			} else {
				var css = compatibleTheme(json)
			}
			e.sender.send('theme-css-response', css);
		} catch (e) {
			var css = "";
		}

	})
	function compatibleTheme(json) {
		var primary = json.vars.primary;
		var secondary = json.vars.secondary;
		var text = json.vars.text;
		if (json.base == "light") {
			var drag = "rgba(255, 255, 255, 0.8)";
			var beforehover = "#757575";
			var selected = "#3f3f3f"
			var selectedWithShare = "#b2babd"
			var gray = "#757575"
		} else {
			var drag = "rgba(0, 0, 0, 0.8)";
			var beforehover = "#9e9e9e";
			var selected = "#c0c0c0"
			var selectedWithShare = "#003a30"
			var gray = "#cccccc"
		}
		if (json.advanced) {
			if (json.advanced.TheDeskAccent) {
				var emphasized = json.advanced.TheDeskAccent
			} else {
				var emphasized = secondary
			}
			if (json.advanced.TheDeskActive) {
				var active = json.advanced.TheDeskActive
			} else {
				var active = primary
			}
			if (json.advanced.TheDeskModal) {
				var modal = json.advanced.TheDeskModal
			} else {
				var modal = secondary
			}
			if (json.advanced.TheDeskBottom) {
				var bottom = json.advanced.TheDeskBottom
			} else {
				var bottom = primary
			}
			if (json.advanced.TheDeskPostbox) {
				var postbox = json.advanced.TheDeskPostbox
			} else {
				var postbox = primary
			}
			if (json.advanced.TheDeskSubcolor) {
				var subcolor = json.advanced.TheDeskSubcolor
			} else {
				var subcolor = primary
			}
		} else {
			var emphasized = primary
			var acs = secondary
			var active = primary
			var modal = secondary
			var bottom = primary
			var postbox = primary
			var subcolor = primary
		}

		var css = ".customtheme {--bg:" + secondary + ";--drag:" + drag + ";" +
			"--text:" + text + ";--beforehover:" + beforehover + ";--modal:" +
			modal + ";--thirdColor:" + subcolor + ";--subcolor:" + subcolor +
			";--bottom:" + bottom + ";--accent:" + emphasized + ";" +
			"--subcolor:" + secondary + ";--emphasized:" + active + ";--his-data:" +
			secondary +
			";--active:" + active + ";--postbox:" + postbox + ";--modalfooter:" +
			primary +
			";--active:" + subcolor + ";--selected:" + selected + ";--selectedWithShare:" + selectedWithShare + "}" +
			"--gray:" + gray + ";" +
			".customtheme #imagemodal{background: url(\"../img/pixel.svg\");}";
		return css
	}
	ipc.on('theme-json-list', function (e, arg) {
		var files1 = fs.readdirSync(join(app.getAppPath(), '/source/themes'))
		var file1List = files1.filter(function (file) {
			if (file.match(/\.thedesktheme$/)) {
				var tfile = join(app.getAppPath(), '/source/themes', file)
				return fs.statSync(tfile).isFile() && /.*\.thedesktheme$/.test(tfile)
			} else {
				return null
			}
		})
		var themes = [];
		for (var i = 0; i < file1List.length; i++) {
			var themecss = join(app.getAppPath(), '/source/themes', file1List[i]);
			var json = JSON5.parse(fs.readFileSync(themecss, 'utf8'));
			let compat = true
			if (json.version) compat = false
			themes.push({
				name: json.name,
				id: json.id,
				compatible: compat,
				default: true
			})
		}
		var files2 = fs.readdirSync(app.getPath("userData"))
		var file2List = files2.filter(function (file) {
			if (file.match(/\.thedesktheme$/)) {
				var tfile = join(app.getPath("userData"), file)
				return fs.statSync(tfile).isFile() && /.*\.thedesktheme$/.test(tfile)
			} else {
				return null
			}
		})
		for (var i = 0; i < file2List.length; i++) {
			var themecss = join(app.getPath("userData"), file2List[i]);
			var json = JSON5.parse(fs.readFileSync(themecss, 'utf8'));
			let compat = true
			if (json.version) compat = false
			themes.push({
				name: json.name,
				id: json.id,
				compatible: compat,
				default: false
			})
		}
		e.sender.send('theme-json-list-response', themes);
	})
}
exports.css = css;
