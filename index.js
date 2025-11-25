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

  // Show chat messages
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
      console.log("[BOT] Starting AFK Mining…");
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
   🔥 CONTINUOUS LEFT CLICK MINING (NO ROTATE)
--------------------------------------------------*/
function startMiningLoop() {
  bot.clearControlStates(); // no movement

  setInterval(() => {
    const block = bot.blockAtCursor(5); // block in front

    if (!block) {
      console.log("[BOT] No block in front.");
      return;
    }

    // Start left-click (break start)
    bot._client.write("block_dig", {
      status: 0, // start digging / left click down
      location: block.position,
      face: 1
    });

    // Hold left-click
    bot._client.write("block_dig", {
      status: 1, // keep breaking (left click hold)
      location: block.position,
      face: 1
    });

    console.log("[BOT] Holding left click on:", block.name);
  }, 10); // Fast / smooth
}

/* ------------ Auto /fix -------------- */
function startFixLoop() {
  setInterval(() => {
    bot.chat("/fix");
    console.log("[BOT] Sent /fix");
  }, 5 * 60 * 1000);
}

/* ------------ Durability Info ------------ */
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
