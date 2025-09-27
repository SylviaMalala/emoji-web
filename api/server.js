const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'db.json');
const cors = require('cors');
app.use(cors());

app.use(express.json());

function getEmojis() {
	try {
		const data = fs.readFileSync(DB_PATH, 'utf8');
		const json = JSON.parse(data);
		if (Array.isArray(json.emojis)) {
			return json.emojis;
		} else if (json.emojis && Array.isArray(json.emojis.emojis)) {
			return json.emojis.emojis;
		}
		return [];
	} catch (err) {
		return [];
	}
}

app.get('/emojis', (req, res) => {
	const emojis = getEmojis();
	res.json(emojis);
});

app.get('/emojis/:slug', (req, res) => {
	const emojis = getEmojis();
	const emoji = emojis.find(e => e.slug === req.params.slug);
	if (emoji) {
		res.json(emoji);
	} else {
		res.status(404).json({ error: 'Emoji not found' });
	}
});

app.listen(PORT, () => {
	console.log(`Emoji server running on port ${PORT}`);
});
