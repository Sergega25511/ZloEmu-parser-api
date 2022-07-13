const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

async function routes(fastify) {

    fastify.get("/BF3/User/:name", async (request, reply) => {
        const username = request.params.name
        const config = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
            },
            url: 'https://zloemu.net/user/bf3stats',
            data: `name=${username}`
        }

        const skillsNameArray = ["K/D", "W/L", "Accuracy","Kills", "HEADSHOTS", "TIME"]
        const zloEmu = await axios(config)
        const dom = new JSDOM(zloEmu.data)
        const blocks = dom.window.document.getElementsByClassName('tab-content')[0].getElementsByClassName('tab-pane fade in active')[0]
        const userRank = blocks.getElementsByTagName('tbody')[0].getElementsByClassName('text-center')[0].getElementsByTagName('p')[0].textContent
        const userXP = blocks.getElementsByTagName('tbody')[0].getElementsByClassName('pull-left')[0].textContent
        const lol = blocks.getElementsByTagName('tbody')[1].getElementsByTagName("h2")[0].textContent
        const skills = blocks.getElementsByTagName('tbody')[1].getElementsByTagName("b")
        const skillsObj = {"wtf": lol}
        const statsObj = {}
        const stats = blocks.getElementsByClassName('row')[1].getElementsByClassName('col-md-4 no-padd')
        for (let i = 0; i < skills.length; i++) {
            skillsObj[skillsNameArray[i]] = skills[i].textContent
        }
        for (let i = 0; i < stats.length; i++) {
            const newStats = stats[i].getElementsByTagName('tbody')[0].getElementsByTagName('td')
            for (let i = 0; i < newStats.length; i++) {
                if ((i % 2) === 0){
                    statsObj[newStats[i].textContent] = newStats[i + 1].textContent
                }
            }
        }
        console.log(`ip: ${request.ip}, looking for user ${username}`)
        await reply.send({
            UserRank:{nickname: username,
                rank:userRank,
                xp:userXP,
            },
            Skill: skillsObj,
            Stats: statsObj
        })
    });
    fastify.get("/BF4/User/:name", async (request, reply) => {
        const username = request.params.name
        const config = {
            method: 'post',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                "Accept-Language": "ru-RU,ru;q=0.9,en-US;q=0.8,en;q=0.7"
            },
            url: 'https://zloemu.net/user/bf4stats',
            data: `name=${username}`
        }
        const zloEmu = await axios(config)
        const dom = new JSDOM(zloEmu.data)
        const statsObj = {"Username": username}
        const stats = dom.window.document.getElementsByClassName('table')[0].getElementsByTagName('tbody')[0].getElementsByTagName('td')
        for (let i = 0; i < stats.length; i++){
            if ((i % 2) === 0){
                statsObj[stats[i].textContent] = stats[i + 1].textContent
            }
        }
        console.log(`ip: ${request.ip}, looking for user ${username}`)
        await reply.send(statsObj)
    });
}

module.exports = routes;