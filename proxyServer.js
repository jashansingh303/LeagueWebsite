var express = require("express")
var cors = require("cors")
const axios = require("axios")

var app = express()



app.use(cors({
    origin: "*"
}))

const API_KEY = "RGAPI-33a2cf7f-74e4-4d0e-9e33-fb03222331f7"

app.get("/playerData", async (req,res)=>{
    const playerName = req.query.username
    axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName +"?api_key=" + API_KEY, {headers: {
        'Accept-Encoding': 'identity',
      }})
    .then(response => {
        console.log(response.data)
        return response.data
    }).catch(err=>err)
})

function getPlayerPUUID(playerName){
    return axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName +"?api_key=" + API_KEY, {headers: {
        'Accept-Encoding': 'identity',
      }})
    .then(response => {
        console.log(response.data)
        return response.data.puuid
    }).catch(err=>err)
}

app.get("/past5Games", async (req,res)=>{
    const playerName = req.query.username
    const PUUID = await getPlayerPUUID(playerName)
    
    const gameIDs = await axios.get("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/" + PUUID + "/ids" +"?api_key=" + API_KEY, {headers: {
        'Accept-Encoding': 'identity',
      }})
    .then(response => response.data)
    .catch(err=>err)

    console.log(gameIDs)

    const matchDataArray = []

    for (var i = 0; i<gameIDs.length - 15; i++){
        const matchID = gameIDs[i]
        const matchData = await axios.get("https://americas.api.riotgames.com/lol/match/v5/matches/" + matchID +"?api_key=" + API_KEY, {headers: {
            'Accept-Encoding': 'identity',
          }})
        .then(response => response.data)
        .catch(err=>err)
        
        matchDataArray.push(matchData)
    }
    res.json(matchDataArray)
})

app.listen(4000, function() {
    console.log("server started on port 4000")
})