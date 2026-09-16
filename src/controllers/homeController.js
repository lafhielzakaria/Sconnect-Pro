const { render } = require('../core/renderer');

async function index(req, res) {
    await render(res, 'dashboard', {});
}

module.exports = { index };