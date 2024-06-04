export class Game{
    constructor(id, week, date, time, home, away, winner){
        this.id = id;
        this.week = week;
        this.date = date;
        this.time = time;
        this.home = home;
        this.away = away;
        this.winner = winner;
    }

    static fromSheetRow(row, id){
        let week = row[0];
        let date = moment(row[1], 'MM/DD/YYYY');
        let time = row[2];
        let home = row[3];
        let away = row[4];
        let winner = row[5];

        return new Game(id, week, date, time, home, away, winner);
    }

    getOpponent(team){
        return team === this.home ? this.away : this.home;
    }
}