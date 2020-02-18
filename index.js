const { FORCE_COLOR, NODE_DISABLE_COLORS, TERM } = process.env;

const $ = {
	enabled: !NODE_DISABLE_COLORS && TERM !== 'dumb' && FORCE_COLOR !== '0'
};

const CODES = {
	// modifiers
	reset: code(0, 0),
	bold: code(1, 22),
	dim: code(2, 22),
	italic: code(3, 23),
	underline: code(4, 24),
	inverse: code(7, 27),
	hidden: code(8, 28),
	strikethrough: code(9, 29),

	// colors
	black: code(30, 39),
	red: code(31, 39),
	green: code(32, 39),
	yellow: code(33, 39),
	blue: code(34, 39),
	magenta: code(35, 39),
	cyan: code(36, 39),
	white: code(97, 39),
	gray: code(90, 39),

	// light colors
	lightGray: code(37, 39),
	lightRed: code(91, 39),
	lightGreen: code(92, 39),
	lightYellow: code(93, 39),
	lightBlue: code(94, 39),
	lightMagenta: code(95, 39),
	lightCyan: code(96, 39),

	// background colors
	bgBlack: code(40, 49),
	bgRed: code(41, 49),
	bgGreen: code(42, 49),
	bgYellow: code(43, 49),
	bgBlue: code(44, 49),
	bgMagenta: code(45, 49),
	bgCyan: code(46, 49),
	bgWhite: code(107, 49),
	bgGray: code(100, 49),

	// background light colors
	bgLightRed: code(101, 49),
	bgLightGreen: code(102, 49),
	bgLightYellow: code(103, 49),
	bgLightBlue: code(104, 49),
	bgLightMagenta: code(105, 49),
	bgLightCyan: code(106, 49),
	bgLightGray: code(47, 49),
};

function code(open, close) {
	return {
		open: `\x1b[${open}m`,
		close: `\x1b[${close}m`,
		rgx: new RegExp(`\\x1b\\[${close}m`, 'g')
	};
}

function run(arr, str) {
	let i=0, tmp={};
	for (; i < arr.length;) {
		tmp = Reflect.get(CODES, arr[i++]);
		str = tmp.open + str.replace(tmp.rgx, tmp.open) + tmp.close;
	}
	return str;
}

function chain(keys) {
	let ctx = { keys };

	ctx.reset = $.reset.bind(ctx);
	ctx.bold = $.bold.bind(ctx);
	ctx.dim = $.dim.bind(ctx);
	ctx.italic = $.italic.bind(ctx);
	ctx.underline = $.underline.bind(ctx);
	ctx.inverse = $.inverse.bind(ctx);
	ctx.hidden = $.hidden.bind(ctx);
	ctx.strikethrough = $.strikethrough.bind(ctx);

	ctx.black = $.black.bind(ctx);
	ctx.red = $.red.bind(ctx);
	ctx.green = $.green.bind(ctx);
	ctx.yellow = $.yellow.bind(ctx);
	ctx.blue = $.blue.bind(ctx);
	ctx.magenta = $.magenta.bind(ctx);
	ctx.cyan = $.cyan.bind(ctx);
	ctx.white = $.white.bind(ctx);
	ctx.gray = $.gray.bind(ctx);

	ctx.lightRed = $.lightRed.bind(ctx);
	ctx.lightGreen = $.lightGreen.bind(ctx);
	ctx.lightYellow = $.lightYellow.bind(ctx);
	ctx.lightBlue = $.lightBlue.bind(ctx);
	ctx.lightMagenta = $.lightMagenta.bind(ctx);
	ctx.lightCyan = $.lightCyan.bind(ctx);
	ctx.lightGray = $.lightGray.bind(ctx);

	ctx.bgBlack = $.bgBlack.bind(ctx);
	ctx.bgRed = $.bgRed.bind(ctx);
	ctx.bgGreen = $.bgGreen.bind(ctx);
	ctx.bgYellow = $.bgYellow.bind(ctx);
	ctx.bgBlue = $.bgBlue.bind(ctx);
	ctx.bgMagenta = $.bgMagenta.bind(ctx);
	ctx.bgCyan = $.bgCyan.bind(ctx);
	ctx.bgGray = $.bgGray.bind(ctx);
	ctx.bgWhite = $.bgWhite.bind(ctx);

	ctx.bgLightRed = $.bgLightRed.bind(ctx);
	ctx.bgLightGreen = $.bgLightGreen.bind(ctx);
	ctx.bgLightYellow = $.bgLightYellow.bind(ctx);
	ctx.bgLightBlue = $.bgLightBlue.bind(ctx);
	ctx.bgLightMagenta = $.bgLightMagenta.bind(ctx);
	ctx.bgLightCyan = $.bgLightCyan.bind(ctx);
	ctx.bgLightGray = $.bgLightGray.bind(ctx);

	return ctx;
}

function init(key) {
	return function (txt) {
		let isChain = !!this.keys;
		if (isChain) this.keys.includes(key) || this.keys.push(key);
		if (txt !== void 0) return $.enabled ? run(isChain ? this.keys : [key], txt+'') : txt+'';
		return isChain ? this : chain([key]);
	};
}

for (let key in CODES) {
	Object.defineProperty($, key, {
		value: init(key),
		writable: false
	});
}

module.exports = $;
