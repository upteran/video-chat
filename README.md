# Websocket Messages + Video Chat

This is a WebSocket-based chat project that allows users to join a chat room and 
communicate with other users in real-time. This project doesn't use any database for 
data storage and only uses server memory. 
The project is built using:

- Reactjs
- Typescript
- ESlint
- Prettier
- Node.js
- WebSocket
- WebRTC

Project include few services

- web client chat (@chat/client)
- chat server (@chat/server)

[Demo link](https://at-mono-chat-client.herokuapp.com/)

## Installation

1. Clone the project using the following command
```bash
git clone https://github.com/upteran/video-chat/
```

2. Navigate to the project root directory:
```bash
cd websocket-chat
```

3. Install the dependencies for the server and client packages:
```bash
yarn/pnpm install
```

4. Start client and server:
```bash
npm run dev
```

OR instead 4

- Start the server:
```bash
npm run start:server
```
 
- Start the client:
```bash
npm run start:client
```

## Description

This project is a chat application that allows users to communicate with each other in 
two ways: via simple text messaging or via video chat. 
Users can only engage in one video chat session at a time, 
but they can switch between text and video chats as desired.

The application provides a chat creation feature, where a user can create a 
new chat room and invite others to join. Users can also connect to an existing 
chat room by entering the chat room's unique identifier.

## Architecture
The project is structured as a monorepo with two packages: server and client.

The server package contains the Node.js server code responsible for handling WebSocket connections, managing chat room state, and serving video chat streams.
The client package contains the React-based client code responsible for rendering the chat interface and handling user interactions.

### Server

The server code is written in Node.js and uses the ws package to handle WebSocket 
connections. The server keeps track of the chat room state in memory, 
storing user data and chat history in a JavaScript object. Video chat streams are served using the WebRTC protocol, with the server acting as a signaling server to facilitate peer-to-peer communication.

### Client
The client code is written in React and uses the WebSocket API and WebRTC 
protocol to handle real-time communication with the server. The client renders a 
chat interface with a message input field, a chat history display, and buttons to initiate a video chat session or switch back to text messaging. When a video chat session is initiated, the client renders a video player and a button to end the session.

## Dev workflow

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

### ROADMAP

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

- [x] add: video chat
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
