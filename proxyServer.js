var express = require("express")
var cors = require("cors")
const axios = require("axios")
const home = require("./home")

var app = express()

app.use(cors({
    origin: "*"
}))

const API_KEY = "RGAPI-dc705f89-df0b-47c6-8ac7-215d0a7d4351"

app.use("/home", home)

app.get("/playerData", async (req,res)=>{
    const playerName = req.query.username
    axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName +"?api_key=" + API_KEY, {headers: {
        'Accept-Encoding': 'identity',
      }})
    .then(response => {
        res.json(response.data)
    }).catch(err=>err)
})

app.get("/rankedData", async (req,res)=>{
    const playerName = req.query.username
    const PUUID = await getRankedPlayerPUUID(playerName)
    axios.get("https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/" + PUUID +"?api_key=" + API_KEY, {headers: {
        'Accept-Encoding': 'identity',
      }})
    .then(response => {
        res.json(response.data)
    }).catch(err=>err)
})

function getPlayerPUUID(playerName){
    return axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName +"?api_key=" + API_KEY, {headers: {
        'Accept-Encoding': 'identity',
      }})
    .then(response => {
        return response.data.puuid
    }).catch(err=>err)
}

function getRankedPlayerPUUID(playerName){
    return axios.get("https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" + playerName +"?api_key=" + API_KEY, {headers: {
        'Accept-Encoding': 'identity',
      }})
    .then(response => {
        return response.data.id
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

const port = process.env.PORT || 4000

app.listen(port, function() {
    console.log(`server started on port ${port}`)
})