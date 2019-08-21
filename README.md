# Online Reversi

A simple web app for playing the game Reversi online.

## Technology

* Node.js
* MySQL
* HTML/CSS/JS

## Intended Features

* Host a game, get unique link to send to your friends
* Join an existing game from a link
* Close the page and return to it later without losing the game state
* Prevent cheating with server-side checks

## How to run:

```
$ cp connection.example.js connection.js
```

Then edit `connection.js` so it has the real database credentials.

```
$ npm install
$ npm start
```

## Testing

We use [mocha](https://mochajs.org/) for testing. Put unit tests in the `test`
folder, and use `npm test` to run them.
