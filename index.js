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

  // Show all chats in console
  bot.on("message", msg => console.log("[CHAT] " + msg.toString()));

  bot.on("spawn", () => {
    console.log("[BOT] Spawned");

    // --- LOGIN ---
    setTimeout(() => {
      bot.chat(`/login ${CONFIG.password}`);
      console.log("[BOT] Logged in");
    }, 1000);

    // --- WARP ---
    setTimeout(() => {
      bot.chat(CONFIG.warpCommand);
      console.log("[BOT] Warped to mining");
    }, 2500);

    // --- START MINING ---
    setTimeout(() => {
      console.log("[BOT] Starting nonstop left-click mining…");
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
   🔥 NONSTOP LEFT CLICK MINING (NO ROTATE)
--------------------------------------------------*/
function startMiningLoop() {
  bot.clearControlStates(); // no movement

  setInterval(() => {
    const block = bot.blockAtCursor(5);

    if (block) {
      // REAL left-click (attack) on the block
      bot.swingArm("right"); // animation
      bot._client.write("use_item", { hand: 0 }); // continuous action
      bot.attack(block);
      console.log("[BOT] Attacking block:", block.name);
    } else {
      // Still swing even if air (keeps left-click held)
      bot.swingArm("right");
      bot._client.write("use_item", { hand: 0 });
      console.log("[BOT] Clicking air...");
    }

  }, 50); // 20 CPS
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
