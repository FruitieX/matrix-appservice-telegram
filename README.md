# matrix-appservice-telegram
Node.js Telegram bridge for Matrix

## Prerequisites

* Telegram Bot API token, refer to [Telegram Bot API setup](/tg-bot-api.md) for more info
* A working homeserver install
* `npm` and `nodejs`

NB: This how-to refers to the binary node - this may be nodejs depending on your distro.

## Setup

1. `npm install`
2. `cp telegram-config-example.yaml telegram-config.yaml`
3. `$EDITOR telegram-config.yaml`
4. `node index.js -r -u "http://localhost:9090"` or any available port
5. Add path to generated `telegram-registration.yaml` into `homeserver.yaml`, e.g:

    ```
    app_service_config_files: [ "/home/user/matrix-appservice-telegram/telegram-registration.yaml" ]
    ```
6. `node index.js -p 9090 -c telegram-config.yaml`, use same port as in step 4
