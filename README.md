### Des-Darona (rona taken from corona and des-da adapted from des-damona from Othello) 

This is a POC covid 19 blockchain based game which experiments with the notion of streamable tokens through the use of the sablier protocol the aim of the game is to collect as many vaccines to recover a countries infected count the longer you last through collecting the vaccines the longer the stream will last after the player has died **The game tries to theme its self according to the colors of the the selected country **

### Break down of game (Screenshots)
1. ![Usage](/screenshots/1.png)
2. ![Usage](/screenshots/2.png)
3. ![Usage](/screenshots/3.png)
The Globe displays realtime corona virus infections which when a user right clicks on a country the user will have to collect as many vacciness in relation to the number of infections so for instance if a county has 100 infections the user will have to survive 3 rounds of 8000m collecting vaccines if a user doesnt collect any they loose however many they have collected
4. ![Usage](/screenshots/5.png)

The users Eth address will be required for the token stream to be initiated once the user has die
5. ![Usage](/screenshots/6.png)
Game starts 
6. ![Usage](/screenshots/7.png)
Once the user has died they will be prompted to restart or start the token streaming process, the time frame for the stream is the difference between the time the user started playing and the time they died,
7. ![Usage](/screenshots/8.png)
8. ![Usage](/screenshots/9.png)
Once the transaction has been approved the token stream will only be initiated in 30 minutes so the user will have to copy the tokens address into their wallet and watch the schmoney streaming in XD

### Run locally

``npm install``

### Install embark
``npm install embark -g``

### Run simulator

``embark simulator``

### Start server
``embark run --nodashboard``

### Important

Please ensure you select an account eitheir than the default account when entering an eth address generally the accounts available for the simulator are available when it launches the default no of accounts is 10

**If running on the testnets via the deployed please ensure that you have used the account or the transaction will fail ** <br/><br/>

To check your token balance please copy the token address from the console and use remix connected to the local node to check the balance you may need to upload the token contract and deploy using the tokens existing address
### Web Page

[GitHubPages]( https://brianspha.github.io/Des-Derona/) <br /><br />
[SkyLink]( https://siasky.net/AAAFOSyIn1zTwfR-cjlkBrNutNNcFB1_9v-MPxx3qx0wjg)

