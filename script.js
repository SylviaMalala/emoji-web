const API_URL = 'http://localhost:3000/emojis';

    let emojiList = []; 

    async function loadEmojis() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Emoji API responded with status ' + response.status);
        const data = await response.json();
        emojiList = data;
        console.log('Loaded', emojiList.length, 'emojis');
      } catch (err) {
        console.error('Failed to load emojis:', err);
      }
    }

    function findEmojiForWord(word) {
      word = word.toLowerCase().trim();
      for (const e of emojiList) {
        if (e.slug && e.slug.toLowerCase().includes(word)) return e.character;
        if (e.unicodeName && e.unicodeName.toLowerCase().includes(word)) return e.character;
      }
      return null;
    }

    function translateText(inputText) {
      const words = inputText.split(/\s+/);
      const result = words.map(w => {
        const em = findEmojiForWord(w);
        if (em) return em;
        else return w;
      });
      return result.join(' ');
    }

    document.addEventListener('DOMContentLoaded', async () => {
      await loadEmojis();

      const inputEl = document.getElementById('inputText');
      const btnTranslate = document.getElementById('translateBtn');
      const btnClear = document.getElementById('clearBtn');
      const btnCopy = document.getElementById('copyBtn');
      const outputEl = document.getElementById('output');

      btnTranslate.addEventListener('click', () => {
        const text = inputEl.value;
        if (!text.trim()) {
          outputEl.textContent = '';
          outputEl.appendChild(document.createTextNode('Nothing to translate.'));
          return;
        }
        const translated = translateText(text);
        outputEl.textContent = translated;
      });

      btnClear.addEventListener('click', () => {
        inputEl.value = '';
        outputEl.textContent = '';
      });

      btnCopy.addEventListener('click', () => {
        const text = outputEl.textContent;
        if (!text) return;
        navigator.clipboard.writeText(text).then(() => {
          alert('Copied to clipboard!');
        }).catch(err => {
          console.error('Copy failed:', err);
        });
      });
    });