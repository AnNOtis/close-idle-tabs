<p align="center">
  <h3 align="center">Close Idle Tabs</h3>
  <p align="center">
  <img src="https://github.com/AnNOtis/close-idle-tabs/raw/master/src/assets/logo-128x128.png" width="50" height="50" />
  <p>
  <p align="center">Press a button to close idle tabs</p>
</p>

## Demo

<p>
<img src="https://raw.githubusercontent.com/AnNOtis/close-idle-tabs/master/misc/demo1.png" width="200" />
&nbsp;&nbsp;
<img src="https://raw.githubusercontent.com/AnNOtis/close-idle-tabs/master/misc/demo2.png" width="210" />
</p>

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
