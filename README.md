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
- [] add error boundaries
- [x] add client errors handler
- [] connect messages
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

#### bugs

[] send offer to all users in chat. Need use users Id and connect it with ws connections instances, to compare it when RTC offer is got