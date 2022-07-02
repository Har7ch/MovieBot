require('dotenv').config();
const axios = require('axios');

const { Client, Intents, MessageAttachment, MessageEmbed, Interaction, Channel } = require('discord.js');
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.on('ready', function(e) {
    console.log(`Logged in as ${client.user.tag}`)
});
function removeTags(str) {
    if ((str===null) || (str===''))
        return false;
    else
        str = str.toString();
          
    // Regular expression to identify HTML tags in 
    // the input string. Replacing the identified 
    // HTML tag with a null string.
    return str.replace( /(<([^>]+)>)/ig, '');
}
const prefix = '-';

client.on('messageCreate', function(message){
    if(message.author.bot) return;
    if(message.content.startsWith(prefix)){
        const body = message.content.substring(prefix.length);
        const args = body.split(' ');
        const cmd = args.shift().toLowerCase();  
        let show = '';
        for(let arg of args){
            show += `${arg} `;
        }    
        if(cmd == "ping"){
            const timeTaken = Date.now() - message.createdTimestamp;
            message.reply(`Active with a latency of ${timeTaken}ms`);
        }
        if(cmd == "rating"){
            const config = {params: {q : show}};
            axios.get(`https://api.tvmaze.com/search/shows`,config)
                .then((res) => {
                    // const img = new MessageAttachment(res.data[0].show.image.medium)
                    message.reply(`Rating for the show : ${res.data[0].show.rating.average}`)
                    // console.log(res.data[0].rating);
                })
                .catch((err) =>{
                    console.log(err);
                    message.reply("Can't reach the show");
                })
        }
        else if(cmd == "poster"){
            const config = {params: {q : show}};
            axios.get(`https://api.tvmaze.com/search/shows`,config)
                .then((res) => {
                    const img = res.data[0].show.image.medium;
                    message.reply(img);
                })
                .catch((err) =>{
                    console.log(err);
                    message.reply("Can't show the poster");
                })
        }  
        else if(cmd == "summary"){
            const config = {params: {q : show}};
            axios.get(`https://api.tvmaze.com/search/shows`,config)
                .then((res) => {
                    const sum = removeTags(res.data[0].show.summary);
                    message.reply(sum);
                })
                .catch((err) =>{
                    console.log(err);
                    message.reply("No summary available!");
                })
        }   
        else if(cmd == "webchannel"){
            const config = {params: {q : show}};
            axios.get(`https://api.tvmaze.com/search/shows`,config)
                .then((res) => {
                    const channel = res.data[0].show.webChannel.name;
                    message.reply(channel);
                })
                .catch((err) =>{
                    console.log(err);
                    message.reply("No Web channel!");
                })
        } 
        else if(cmd == "help"){
            message.reply('commands for the bot: \n' + '-ping gives speed latency of the bot \n' + '-rating (show/series name) gives rating \n' + 
            '-poster (show/series name) gives poster \n' + '-summary (show/series name) gives summary \n' + '-webchannel gives streaming platform \n' +
            '-genre (show/series name) gives genre of the show \n' + '-lan (show/series name) gives original language');
        }
        else if(cmd == "genre"){
            const config = {params: {q : show}};
            axios.get(`https://api.tvmaze.com/search/shows`,config)
                .then((res) => {
                    const Genres = res.data[0].show.genres;
                    let input = '';
                    for(let Genre of Genres){
                        input += `${Genre}, `;
                    }
                    message.reply(input);
                })
                .catch((err) =>{
                    console.log(err);
                    message.reply("No particular genre!");
                })            
        }
        else if(cmd == "lan"){
            const config = {params: {q : show}};
            axios.get(`https://api.tvmaze.com/search/shows`,config)
                .then((res) => {
                    const Genres = res.data[0].show.language;
                    let input = Genres;
                    message.reply(input);
                })
                .catch((err) =>{
                    console.log(err);
                    message.reply("result not found!");
                })
        }
    }

});



client.login(process.env.BOT_TOKEN);



