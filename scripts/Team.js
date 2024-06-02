export class Team{
    constructor(city, name, schedule, wins, losses, ties){
        this.city = city;
        this.name = name;
        this.schedule = schedule.sort((a, b) => a.week - b.week);
        this.wins = wins;
        this.losses = losses;
        this.ties = ties;
        this.updatePlayerRecords();
    }

    get fullName(){
        return `${this.city} ${this.name}`;
    }

    updatePlayerRecords(){
        for(let game of this.schedule){
            for(let playerPrediction of game.predictions){
                let player = playerPrediction.player;
                let prediction = playerPrediction.prediction;
                
                if(prediction === 'W' && game.result === 'W'){
                    player.correct++;
                }else if(prediction === 'L' && game.result === 'L'){
                    player.correct++;
                }else if(game.result !== ''){
                    player.incorrect++;
                }
            }
        }
    }

    getTeamPlayerRecord(players){
        let playerRecords = players.map(player => {
            
            let record = this.getPlayerRecord(player);
            return {
                player: player,
                correct: record.correct,
                incorrect: record.incorrect
            }
        });
        console.log(players, playerRecords);
        return playerRecords;
    }

    getPlayerRecord(player){
        let correct = 0;
        let incorrect = 0;
        for(let game of this.schedule){
            let prediction = game.predictions.find(p => p.player.name === player.name);
            if(prediction.prediction === 'W' && game.result === 'W'){
                correct++;
            }else if(prediction.prediction === 'L' && game.result === 'L'){
                correct++;
            }else if(game.result !== ''){
                incorrect++;
            }
        }

        return {correct, incorrect};
    }

    get record(){
        return `${this.wins}-${this.losses}-${this.ties}`;
    }


}