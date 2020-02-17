# Rothiss Wayfarer

Userscript for [Niantic Wayfarer](http://wayfarer.nianticlabs.com/)

## Installation

Rothiss Wayfarer is tested with Chrome. You need a userscript manager like [Tampermonkey](https://tampermonkey.net/).

> **Download:** https://gitlab.com/Rothiss/rothiss-wayfarer/raw/master/wayfarer.js

## Features:
- Additional links to map services like Intel and GoogleMaps.
- Automatically opens the first listed possible duplicate and the "What is it?" filter text box
- Buttons above the comments box to auto-type common 1-star rejection reasons
- Translate text buttons for title and description
- Changed portal markers to small circles, inspired by IITC style
- Made "Nearby portals" list and map scrollable with mouse wheel
- Refresh page if no portal analysis available
- Expiration timer in navigation bar
- **Keyboard navigation**

## Keyboard Navigation

You can use keyboard to fully control the page as follows:

|           Key(s)           |                 Function                 |
| :------------------------: | :--------------------------------------: |
|    Keys 1-5, Numpad 1-5    | Valuate current selected field (the yellow highlighted one) |
|             D              | Mark current candidate as a duplicate of the opened portal in "duplicates" |
|             T              |          Open title translation          |
|             Y              |      Open description translation        |
| Space, Enter, Numpad Enter |     Confirm dialog / Send valuation      |
|       Tab, Numpad +        |                Next field                |
| Shift, Backspace, Numpad - |              Previous field              |
|       Esc, Numpad /        |               First field                |
|           \^, Numpad *     |        Skip Portal (if possible)         |
