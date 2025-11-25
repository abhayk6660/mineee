const mineflayer = require("mineflayer");

const CONFIG = {
  host: "mc.leftypvp.net",
  port: 25565,
  username: "antkind",
  password: "86259233",
  warpCommand: "/is warp mining",
  version: "1.21.1"
};

let bot;

function startBot() {
  bot = mineflayer.createBot({
    host: CONFIG.host,
    port: CONFIG.port,
    username: CONFIG.username,
    version: CONFIG.version
  });

  // Show all chat
  bot.on("message", msg => console.log("[CHAT] " + msg.toString()));

  bot.on("spawn", () => {
    console.log("[BOT] Spawned");

    // Login
    setTimeout(() => {
      bot.chat(`/login ${CONFIG.password}`);
      console.log("[BOT] Logged in");
    }, 1000);

    // Warp
    setTimeout(() => {
      bot.chat(CONFIG.warpCommand);
      console.log("[BOT] Warped to mining");
    }, 2500);

    // Start loops
    setTimeout(() => {
      console.log("[BOT] Starting OBSIDIAN nonstop mining…");
      startMiningLoop();
      startFixLoop();
      startDurabilityLoop();
    }, 5000);
  });

  bot.on("error", err => console.log("[ERROR]", err));

  bot.on("end", () => {
    console.log("[BOT] Disconnected. Reconnecting in 5s…");
    setTimeout(startBot, 5000);
  });
}

/* ------------------------------------------------
   🔥 CONSTANT OBSIDIAN-TIMED LEFT-CLICK MINING
   - NEVER checks block type
   - NEVER checks block in front
   - ALWAYS mines like obsidian
--------------------------------------------------*/
function startMiningLoop() {
  bot.clearControlStates(); // no movement ever

  setInterval(() => {
    // Swing arm like holding left-click
    bot._client.write("arm_animation", { hand: 0 });

    // Simulate holding LMB (attack mode)
    bot._client.write("use_item", {
      hand: 0
    });

    console.log("[BOT] Mining (forced OBSIDIAN speed)…");

  }, 250); // perfect obsidian mining click speed (4 CPS)
}

/* ------------ Auto /fix every 5 min -------------- */
function startFixLoop() {
  setInterval(() => {
    bot.chat("/fix");
    console.log("[BOT] Sent /fix");
  }, 5 * 60 * 1000);
}

/* ------------ Durability Logging ------------ */
function startDurabilityLoop() {
  setInterval(() => {
    const tool = bot.heldItem;

    if (!tool) {
      console.log("[DURABILITY] No tool in hand");
      return;
    }

    const max = tool.maxDurability || 1561;
    const used = tool.durabilityUsed || 0;
    const remaining = max - used;

    console.log(`[DURABILITY] ${tool.name} => ${remaining}/${max}`);

    if (remaining < 50) {
      console.log("[WARNING] ⚠ Tool low durability!");
    }
  }, 3000);
}

startBot();
