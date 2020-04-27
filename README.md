## BattleShip

A Battleshop application. It is based on the Svelte framework and some websocket reflecting on the server side. While no code is stored on the server (the current state is stored in the browser's local storage) we need a way to connect two clients together. Once client serves as the gameboard where the other client serves as a view. There is also an option to add the view into OBS through a query parameter.

## Gameboard

To start a new game, a user can go to gameboard and select GAME BOARD. There you can place your ships and start "shooting". Below the board is a unique ID that identifies this client/board. You can provide this ID to other people that can then view your board. Those clients only see where you mark a shot as happened and if there was a ship hit or not. You control the actual shots through the GAME BOARD interface.

The View can also be supplied to a browser windows in OBS by amending the URL as follows:
```
?gameid=[your game id]&obs
```
