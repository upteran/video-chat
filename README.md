# Chat app example

Project include few services
- web client chat (@chat/client)
- chat server (@chat/server)

[Demo link](https://at-mono-chat-client.herokuapp.com/)

## Use cases

- Can create user and room
- To share room link click "copy" btn
- To connect list of users in one room
- Send message to room
- Start video call to one of the room users

## Description

- Chat hasn't any DB and messages and history of current room will be deleted after
server restart or all user will clear they local storage (cookie, localStorage)

## Dev workflow

Project uses monorepo dev way to store all packages connected with project
- packages/chat-client
- packages/server

For handle packages uses [lerna](https://lerna.js.org/docs/getting-started) and [pnpm workspaces](https://pnpm.io/)

### Install

```bash
npm install lerna

pnpm install 
```

### dev

```bash
"dev": "lerna run dev", // run both dev packages 
"start:client": "lerna run dev --scope=@chat/client", // run only client
"start:server": "lerna run dev --scope=@chat/server" // run only server
```

### Build

```bash
"build": "lerna run build" // build all packages

or

// can run pnpm run build from package directory 
```

### API 

- Can find all api docs in packages README

### ENV

- web and server client starts on you local ip addresses. For valid connect 
web client to WS Server need to pass `env` variables
```text
WS_HOST={you_local_ip}
WS_PORT={you_local_port}
```

### HTTPS

To valid check and develop video calls, need use https and wss protocols. You can run 
servers with custom certificates, and pass it to webpack-server and chat server apps

Steps:

- [create certificates](https://github.com/FiloSottile/mkcert)
- store it in each package folder

## Run project

- create certificates and store it
- add .env to web-client
- install dependencies
- run dev mode


=======


### DEV NOTES

### workflow

### roadmap

#### infrastructure

- [x] customize logger
- [] add multi chat support
- [] add tests
- [x] upd: refactor ws service (reconnect, diff client handlers)
- [x] add: css styles
- [x] remove: scss
- [] add docs / api readme / descriptions
- [] add redis
- [] add docker
- [] check blockchain ?
- [] add security auth
- [] remove users ws streams on exit
- [x] add error boundaries
- [x] add client errors handler
- [] connect messages
- [] add lerna / separate server and client code
#### text chat
- [x] add: create or find chat room
- [x] add: server message handlers
- [] replace name match with id
- [] diff versions of chat window (sm, md, lg)
- [] add user action messages
- [] add keyboard access (send, change position)
- [] upd: window and user list design
#### video chat
- [X] add: video chat
- [x] upd: video chat remove connect
- [x] upd: video both remote stream work
- [] add: video chat disconnect and call messages
- [] customizing video window
- [] handle slow network cases
- [] reconnects

#### CI/CD 

- [] check what proj change and toggle only one proj
- [] use lerna for checks and run commands


#### bugs
[] send offer to all users in chat. Need use users Id and connect it with ws connections instances, to compare it when RTC offer is got
