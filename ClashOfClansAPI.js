const request = require('request');
const { Client, GatewayIntentBits } = require('discord.js');
const { EmbedBuilder } = require('discord.js');

const client = new Client(
    {
        intents : 
        [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMembers,
            GatewayIntentBits.GuildWebhooks,
        ]
    }
);
function PlayerInfo(tag, callback){
    request
    (
        {
            method: `GET`,
            url: `https://api.clashofclans.com/v1/players/%23${tag}`,
            headers:
            {
                "Authorization": "Bearer "
            }

        },
        (err,res,body) =>
        {
            if (err){console.log(err)};
            const player = JSON.parse(body);
            var username = player.name;
            var townHall = player.townHallLevel;
            var MainTrophies = player.trophies;
            var peakTrophies = player.bestTrophies;
            var League = player.league.name
            var builderHall = player.builderHallLevel;
            var VersusTrophies = player.versusTrophies;

            callback(null, {player});
        }
    );
}

function ClanInfo(tag, callback){
    request
    (
        {
            method: "GET",
            url: `https://api.clashofclans.com/v1/clans/%23${tag}`,
            headers: 
                {
                    "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjI4OWRmOTA5LTA5MTMtNGZjMi1iN2Q1LTAxYmJjZWYxMjYxNyIsImlhdCI6MTY4MDU2NDE4MSwic3ViIjoiZGV2ZWxvcGVyL2ZmYTExM2ZhLWVkNzItMjkxNS05NjJkLTNlZjlhMjQ0NDZkYyIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjkyLjIxLjIxNS4xNTQiXSwidHlwZSI6ImNsaWVudCJ9XX0.wS2dJodP6nq9UXTumkNE74Q0R1lC4D6Cq5T9Stbyo53hYrUSpYh40lVTpCWk5V3qbp5hwd3scpb9uW2xYNzxdw"
                }
        }, 
        (err, res, body) => 
        {
            if (err)
            {
                console.log(err);
            }
            const clan = JSON.parse(body);
            callback(null, {clan});
        }
    );
};

client.on(`messageCreate`, async (message) => {
    const args = message.content.split(' ');
    if (args[0].toLocaleLowerCase() === `.clan`){
        const tag = args[1];
        ClanInfo(tag, (err, body) => {
            if (err) {message.channel.send(err)};
            const ClanEmbed = new EmbedBuilder()
                .setColor(0xF1D412)
                .setTitle(body.clan.name)
                .setURL(`https://link.clashofclans.com/en?action=OpenClanProfile&tag=${tag}`)
                .setDescription(`**Description**\n${body.clan.description}`)
                .setThumbnail(`${body.clan.badgeUrls.large}`)
                .addFields(
                    {name: `Required TownHall `, value: `${body.clan.requiredTownhallLevel}`},
                    {name: `Required Trophies `, value: `${body.clan.requiredTrophies}`},
                    {name: `Required Versus Trophies `, value: `${body.clan.requiredVersusTrophies}`},
                    {name: `Clan Leader`, value: `${body.clan.memberList.find(member => member.role === 'leader').name}`, inline: true},
                    {name: `Join Type`, value: `${body.clan.type}`, inline: true},
                    {name: `Amount of members`, value: `${body.clan.members}`, inline: true},
                    {name: `Chat Language`, value: `${body.clan.chatLanguage.name}`, inline: true},
                    {name: `War League`, value: `${body.clan.warLeague.name}`, inline: true},
                    {name: `Family Friendly`, value: `${body.clan.isFamilyFriendly}`, inline: true},
                    {name: `Total Trophies`, value: `${body.clan.clanPoints}`, inline: true},
                    {name: `Total Versus Trophies`, value: `${body.clan.clanVersusPoints}`, inline: true},
                    {name: `Total Clan Capital Points`, value: `${body.clan.clanCapitalPoints}`, inline: true},
                )
            message.channel.send({ embeds: [ClanEmbed] });
        })
    }
    if (args[0].toLocaleLowerCase() === `.player`){
        const tag = args[1];
        PlayerInfo(tag, (err, body) => {
            if (err) {message.channel.send(err)};
            const ClanEmbed = new EmbedBuilder()
                .setColor(0xF1D412)
                .setTitle(body.player.name)
                .setURL(`https://link.clashofclans.com/en?action=OpenPlayerProfile&tag=${tag}`)
                .setThumbnail(`${body.player.league.iconUrls.medium}`)
                .addFields(
                    {name: `Player TownHall`, value: `${body.player.townHallLevel}`, inline: true},
                    {name: `TH Weapon Level`, value: `${body.player.townHallWeaponLevel}`, inline: true},
                    {name: `Player Level`, value: `${body.player.expLevel}`, inline: true},
                    {name: `Trophies`, value: `${body.player.trophies}`, inline: true},
                    {name: `Best Trophies`, value: `${body.player.bestTrophies}`, inline: true},
                    {name: `Versus Trophies + Best`, value: `${body.player.versusTrophies} best ${body.player.bestVersusTrophies}`, inline: true},
                    {name: `Troop Donations`, value: `${body.player.donations}`, inline: true},
                    {name: `Troops Recieved`, value: `${body.player.donationsReceived}`, inline: true},
                    {name: `Capital Contributions`, value: `${body.player.clanCapitalContributions}`, inline: true},
                    {name: `War Stars`, value: `${body.player.warStars}`, inline: true},
                    {name: `War Preferences`, value: `${body.player.warPreference}`, inline: true},        
                    {name: `Clan Name`, value: `${body.player.clan.name}`, inline: true},
                )
            message.channel.send({ embeds: [ClanEmbed] });
        })
    }
});

client.on('ready', async () => {
    console.log(`${client.user.username} is on`);
});

client.login(`TOKEN`);
