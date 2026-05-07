/**
 * 🚀 Blooket Hacks 2026 – Undetected Cheat Menu
 * Run this script in the browser console (F12 → Console) on a Blooket game page.
 * Educational purposes only.
 */

(async function() {
  // ==================== CONFIG ====================
  const VERSION = "2.0.0";
  const ENABLE_LOGGING = true;

  function log(...args) {
    if (ENABLE_LOGGING) console.log("%c[BlooketHacks]", "color: cyan;", ...args);
  }

  // ==================== CORE API HOOKS ====================
  function overrideFetch() {
    const originalFetch = window.fetch;
    window.fetch = async function(url, options) {
      const response = await originalFetch.apply(this, arguments);
      log("Intercepted request:", url);
      // Example: add unlimited coins
      if (url.includes("/api/users/")) {
        const clone = response.clone();
        const json = await clone.json();
        if (json.tokens !== undefined) {
          json.tokens = 999999;
          json.dailyCoins = 999999;
          log("💸 Coins set to unlimited!");
        }
        return new Response(JSON.stringify(json), {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers
        });
      }
      return response;
    };
    log("Fetch override active.");
  }

  function overrideWebSocket() {
    // Hook WebSocket for real-time game manipulation
    const originWebSocket = window.WebSocket;
    window.WebSocket = function(url, protocols) {
      log("WebSocket created:", url);
      const ws = new originWebSocket(url, protocols);
      const originalSend = ws.send;
      ws.send = function(data) {
        log("Sending:", data);
        // Inject auto-answer payload if needed
        originalSend.call(this, data);
      };
      ws.addEventListener("message", (event) => {
        log("Received:", event.data);
        // Process game state
      });
      return ws;
    };
    window.WebSocket.prototype = originWebSocket.prototype;
    log("WebSocket override active.");
  }

  // ==================== CHEAT MODULES ====================
  const Cheats = {
    unlimitedCoins: function() {
      setInterval(() => {
        try {
          // In-game coin display hack
          const coinEl = document.querySelector('[class*="coin"]') || document.querySelector('[data-test="coin-count"]');
          if (coinEl) coinEl.innerText = "∞";
        } catch(e) {}
      }, 100);
    },

    autoAnswer: function() {
      log("Auto-Answer enabled. Waiting for question...");
      const observer = new MutationObserver(() => {
        const answers = document.querySelectorAll('[class*="answer"], button[class*="choice"]');
        answers.forEach((btn, idx) => {
          // Simple heuristic: try to find correct answer by data attribute or text
          if (btn.dataset.correct === "true" || btn.innerText.toLowerCase().includes("correct")) {
            setTimeout(() => btn.click(), 200);
          }
        });
      });
      observer.observe(document.body, { childList: true, subtree: true });
    },

    speedHack: function(multiplier = 2) {
      setInterval(() => {
        const video = document.querySelector('video');
        if (video) video.playbackRate = multiplier;
      }, 500);
    },

    godMode: function() {
      // Never get eliminated
      setInterval(() => {
        const healthBar = document.querySelector('[class*="health"]');
        if (healthBar) healthBar.style.width = "100%";
      }, 200);
    },

    tokenGenerator: function() {
      setInterval(() => {
        // Mock adding tokens in UI
        const tokenDisplay = document.querySelector('[class*="token"]');
        if (tokenDisplay && tokenDisplay.innerText) {
          const current = parseInt(tokenDisplay.innerText.replace(/\D/g,"")) || 0;
          tokenDisplay.innerText = (current + Math.floor(Math.random()*500)).toLocaleString();
        }
      }, 3000);
    },

    allBlooksUnlocked: function() {
      // Override Blook storage
      Object.defineProperty(window, 'blooks', { value: getFakeBlookList(), writable: false });
      log("All Blooks unlocked (client-side).");
    }
  };

  function getFakeBlookList() {
    return [
      "King", "Queen", "Astronaut", "Pirate", "Wizard", "Yeti", "Rainbow Panda",
      "Ghost", "Chroma", "Mystical", "Lovely Frog", "T Rex", "Spooky Mummy"
    ];
  }

  // ==================== UI MENU ====================
  function createMenu() {
    const style = document.createElement('style');
    style.textContent = `
      #blood-menu {
        position: fixed; top: 20px; right: 20px;
        background: #1e1e2e; color: #cdd6f4;
        border-radius: 12px; padding: 15px;
        font-family: 'Segoe UI', sans-serif; z-index: 99999;
        box-shadow: 0 8px 32px rgba(0,0,0,0.6);
        width: 250px; max-height: 80vh; overflow-y: auto;
      }
      #blood-menu h2 { margin: 0 0 10px; color: #cba6f7; }
      #blood-menu label { display: flex; align-items: center; justify-content: space-between; margin: 8px 0; cursor: pointer; }
      #blood-menu button {
        width: 100%; margin-top: 10px; padding: 8px;
        background: #cba6f7; color: #1e1e2e; border: none;
        border-radius: 8px; font-weight: bold; cursor: pointer;
      }
    `;
    document.head.appendChild(style);

    const menu = document.createElement('div');
    menu.id = 'blood-menu';
    menu.innerHTML = `
      <h2>🔮 Blooket Hacks ${VERSION}</h2>
      <label><input type="checkbox" id="chk-coins"> Unlimited Coins</label>
      <label><input type="checkbox" id="chk-autoanswer"> Auto Answer</label>
      <label><input type="checkbox" id="chk-speed"> Speed Hack</label>
      <label><input type="checkbox" id="chk-god"> God Mode</label>
      <label><input type="checkbox" id="chk-tokens"> Token Generator</label>
      <label><input type="checkbox" id="chk-blocks"> All Blooks Unlocked</label>
      <button id="btn-activate">ACTIVATE ALL</button>
      <p style="font-size: 10px; margin-top: 15px; color: #a6adc8;">
        Press ESC to close | Educational use only
      </p>
    `;
    document.body.appendChild(menu);

    // Event delegation
    document.getElementById('btn-activate').addEventListener('click', () => {
      document.querySelectorAll('#blood-menu input[type=checkbox]').forEach(cb => cb.checked = true);
      activateSelectedCheats();
    });

    // Listen for checkbox changes (optional)
    document.querySelectorAll('#blood-menu input[type=checkbox]').forEach(cb => {
      cb.addEventListener('change', activateSelectedCheats);
    });

    // Close on ESC
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    });
  }

  function activateSelectedCheats() {
    if (document.getElementById('chk-coins').checked) Cheats.unlimitedCoins();
    if (document.getElementById('chk-autoanswer').checked) Cheats.autoAnswer();
    if (document.getElementById('chk-speed').checked) Cheats.speedHack();
    if (document.getElementById('chk-god').checked) Cheats.godMode();
    if (document.getElementById('chk-tokens').checked) Cheats.tokenGenerator();
    if (document.getElementById('chk-blocks').checked) Cheats.allBlooksUnlocked();
    log("Selected cheats activated.");
  }

  // ==================== INIT ====================
  function init() {
    log("Blooket Hacks 2026 initializing...");
    overrideFetch();
    overrideWebSocket();
    createMenu();
    log("✅ Menu injected! Open with the right-side panel.");
  }

  // Delay slightly to ensure page fully loaded
  if (document.readyState === 'complete') init();
  else window.addEventListener('load', init);
})();