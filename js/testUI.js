class TestUI{
  constructor(intervalMinInputCont, intervalMaxInputCont, startButtonCont, loadingCont, loadingNumOutputCont, loadingCnfOutputCont,
    canvasRuntimeCont, tableResultCont){
      this._intervalMinInputCont = intervalMinInputCont;
      this._intervalMaxInputCont = intervalMaxInputCont;
      this._startButtonCont = startButtonCont;
      this._loadingCont = loadingCont;
      this._loadingNumOutputCont = loadingNumOutputCont;
      this._loadingCnfOutputCont = loadingCnfOutputCont;
      this._canvasRuntimeCont = canvasRuntimeCont;
      this._tableResultCont = tableResultCont;
      this._resultMap;
  }

  setAction(){
    let self = this;
    this._resultMap = new Map();
    this._startButtonCont.on("click", function(){
      let cnfArray;
      let meanRuntime;
      let startTime, endTime;
      for(let n = parseInt(self._intervalMinInputCont.val()); n <= parseInt(self._intervalMaxInputCont.val()); n++){
        meanRuntime = 0;
        for(let j = 0; j < 100; j++){
          cnfArray = generateCnf(n);
          let algorithm = new Algorithm(n, cnfArray);
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
    let resultMapKeyArray = [];
    let resultMapValueArray = [];
    let bgcolor = [];
    this._resultMap.forEach((value, key)=>{
      resultMapKeyArray.push(key.toString());
      resultMapValueArray.push(parseFloat(value));
      bgcolor.push("#ff0000");
    });
    console.log(resultMapKeyArray);
    console.log(resultMapValueArray);
    let ctx = this._canvasRuntimeCont;
    let chart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: resultMapKeyArray,
        datasets: [{
          data: resultMapValueArray,
          backgroundColor: "rgba(0,0,0,1.0)",
          borderColor: "rgba(0,0,0,0.1)",
        }]
      }
    });
  }
}
