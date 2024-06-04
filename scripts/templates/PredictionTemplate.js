export class PredictionTemplate{
    static renderPredictionButtons(){
        return String.raw`
            <div class="prediction-container mt-2">
                <button class="btn btn-outline-success prediction-button" data-prediction="win">Win</button>
                <button class="btn btn-outline-danger prediction-button" data-prediction="loss">Loss</button>
            </div>
        `
    }
}