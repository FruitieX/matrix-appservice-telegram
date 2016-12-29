const Cli = require('matrix-appservice-bridge').Cli;
const Bridge = require('matrix-appservice-bridge').Bridge;
const AppServiceRegistration = require('matrix-appservice-bridge').AppServiceRegistration;
const AppServiceBot = require('matrix-appservice-bridge').AppServiceBot;

const tgApi = require('node-telegram-bot-api');

const runBridge = (port, config) => {
  // Maps Telegram group name -> Telegram chat ID
  const chatIds = {};
  const tg = new tgApi(config.telegram_api_token, {
    polling: config.telegram_enable_polling
  });

  let bridge;

  tg.on('message', (e) => {
    console.log('got tg message', e);
    const name = e.from.username || `${e.from.first_name} ${e.from.last_name}`;

    chatIds[e.chat.title] = e.chat.id;

    var intent = bridge.getIntent(`@telegram_${name}:${config.matrix_domain}`);
    intent.setDisplayName(`${name} (Telegram)`);
    intent.sendMessage(config.matrix_room_id, {
      msgtype: 'm.text',
      body: e.text,
    });
  });

  bridge = new Bridge({
    homeserverUrl: config.matrix_homeserver_url,
    domain: config.matrix_domain,
    registration: "telegram-registration.yaml",
    controller: {
      onUserQuery: (queriedUser) => {
        console.log('onUserQuery:', queriedUser);
        return {}; // auto-provision users with no additonal data
      },

      onEvent: (request, context) => {
        var event = request.getData();
        if (event.type !== "m.room.message" || !event.content || event.room_id !== config.matrix_room_id) {
          console.log('skipping msg', event);
          return;
        }

        if (!chatIds[config.telegram_group_name]) {
          console.error(`I haven't learned the chat ID of '${config.telegram_group_name}' yet!`);
          console.error(`Invite me to '${config.telegram_group_name}' and greet me in the room so I can learn the chat ID!`);
          return;
        }

        const text = `<${event.user_id}>: ${event.content.body}`;
        tg.sendMessage(chatIds[config.telegram_group_name], text);
      }
    }
  });
  console.log("Matrix-side listening on port %s", port);
  bridge.run(port, config);
};

new Cli({
  registrationPath: 'telegram-registration.yaml',
  generateRegistration: (reg, callback) => {
    reg.setId(AppServiceRegistration.generateToken());
    reg.setHomeserverToken(AppServiceRegistration.generateToken());
    reg.setAppServiceToken(AppServiceRegistration.generateToken());
    reg.setSenderLocalpart('telegram');
    reg.addRegexPattern('users', '@telegram_.*', true);
    callback(reg);
  },
  bridgeConfig: {
    schema: 'telegram-config-schema.yaml'
  },
  run: runBridge
}).run();
