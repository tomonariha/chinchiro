# Chinchiro
Chinchiro is one of dice game.
## Installation
`npm install chinchiro`
## Usage
`node index.js`
## Rules
- Roll 3dices to make role. The stronger one is wins.
- Dealers takes turns. Can pass if you don't like it.
- You can use ikasama dice. But there is penalty if discovered.
- When someone's out of token, Gameset!
### Roles
|Role name|Dice eyes|payout rate|Description|
|---------|---------|-----------|-----------|
|Pinzoro|1,1,1|x5|All dices are 1. The strongest role.|
|Zorome|☆,☆,☆|x3|All dices are same. Strong in order from 6 to 2.|
|Jigoro|4,5,6|x2|4&5&6 combinations.| 
|◯nome|☆,☆,○|x1|One pair & remaining combination.　Remaining dice is strength.<br> Strong in order from 6 to 1.|
|Menasi|others|x1|Make no role all 3times.|
|Hifumi|1,2,3|x-2|1&2&3 combination. the weakest & negative role.|