# Close Idle Tabs

> Press a button to close inactive tabs

<img src="https://github.com/AnNOtis/close-idle-tabs/raw/master/src/assets/logo-128x128.png" width="100" height="100" >

## Run

Development:

```sh
yarn install
yarn run start
```

Build:

```sh
yarn run build
```


## TODOs

- improve activity detect
  - [x] add thresdhold
  - [ ] treat new tab as idle tab
  - [ ] calculate differet window in seperated queue
- Options Page
  - [ ] idle time config
- Browser Action
  - [x] icon
  - [x] badge: displaying idle tabs count
  - [x] popup page: displaying tabs with idle info & a big button to close idle tabs
