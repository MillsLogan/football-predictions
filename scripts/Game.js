export class Game{
    #week;
    #date;
    #time;
    #home;
    #away;
    #winner;
    #predictions;

    constructor(week, date, time, home, away, winner, predictions){
        this.#week = week;
        this.#date = date;
        this.#time = time;
        this.#home = home;
        this.#away = away;
        this.#winner = winner;
        this.#predictions = predictions;
    }

    static fromSheetRow(row, players){
        let predictions = players.map((player, index) => {
            return {
                player: player,
                prediction: row[6 + index]
            }
        });

        let week = row[0];
        let date = moment(row[1].split(",")[1], "MM/DD/YY");
        let time = row[2];
        let home = row[3];
        let away = row[4];
        let winner = row[5];

        return new Game(week, date, time, home, away, winner, predictions);
    }

    set predictions(predictions){
        this.#predictions = predictions;
    }

    get week(){
        return this.#week;
    }

    get date(){
        return this.#date;
    }

    get time(){
        return this.#time;
    }

    get home(){
        return this.#home;
    }

    get away(){
        return this.#away;
    }

    get winner(){
        return this.#winner;
    }

    get predictions(){
        return this.#predictions;
    }
}