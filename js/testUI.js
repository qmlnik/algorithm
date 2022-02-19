class TestUI{
  constructor(intervalMinInputCont, intervalMaxInputCont, heuristicSelectCont, startButtonCont, canvasCont, tableResultCont){
      this._intervalMinInputCont = intervalMinInputCont;
      this._intervalMaxInputCont = intervalMaxInputCont;
      this._heuristicSelectCont = heuristicSelectCont;
      this._startButtonCont = startButtonCont;
      this._canvasCont = canvasCont;
      this._tableResultCont = tableResultCont;
      this._resultMap;
  }

  setAction(){
    let self = this;
    this._startButtonCont.on("click", function(){
      let cnfArray;
      let meanRuntime;
      let startTime, endTime;
      let isHeuristic = self._heuristicSelectCont.val() == "1" ? true : false;
      self._resultMap = new Map();
      for(let n = parseInt(self._intervalMinInputCont.val()); n <= parseInt(self._intervalMaxInputCont.val()); n++){
        meanRuntime = 0;
        for(let j = 0; j < 100; j++){
          console.log("n=" + n + ", " + (j + 1) + "/100");
          cnfArray = generateCnf(n);
          let algorithm = new Algorithm(n, cnfArray, isHeuristic);
          startTime = performance.now();
          algorithm.startAlgorithm();
          endTime = performance.now();
          meanRuntime += endTime - startTime;
        }
        self._resultMap.set(n, (meanRuntime / 100).toFixed(4));
      }

      self._printResultMap();
      self._drawChart();
    });
  }

  _printResultMap(){
    let text = "<tr><th>Változószám</th><th>Átlagos idő</th></tr>";
    this._resultMap.forEach((value, key)=>{
      text += "<tr><td>n=" + key + "</td><td>" + value + "ms</td></tr>"
    })
    this._tableResultCont.html(text);
  }

  _drawChart(){
    this._canvasCont.find("canvas").remove();
    this._canvasCont.append("<canvas class='test-canvas' width='300' height='100'></canvas>");
    let canvas = this._canvasCont.find("canvas");
    let resultMapKeyArray = [];
    let resultMapValueArray = [];
    let bgcolor = [];
    this._resultMap.forEach((value, key)=>{
      resultMapKeyArray.push(key.toString());
      resultMapValueArray.push(parseFloat(value));
      bgcolor.push("#ff0000");
    });
    let ctx = canvas;
    let chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: resultMapKeyArray,
        datasets: [{
          label: "változószám",
          data: resultMapValueArray,
          backgroundColor: "rgba(0, 0, 255, 1.0)",
        }]
      }
    });
  }
}
