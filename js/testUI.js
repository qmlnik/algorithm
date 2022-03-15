class TestUI{
  constructor(intervalMinInputCont, intervalMaxInputCont, startButtonCont, canvasRuntimeCont, canvasMemoryCont, tableResultCont){
      this._intervalMinInputCont = intervalMinInputCont;
      this._intervalMaxInputCont = intervalMaxInputCont;
      this._startButtonCont = startButtonCont;
      this._canvasRuntimeCont = canvasRuntimeCont;
      this._canvasMemoryCont = canvasMemoryCont;
      this._tableResultCont = tableResultCont;
      this._resultMap;
  }

  setAction(){
    let self = this;
    this._startButtonCont.on("click", function(){
      let cnfArray;
      let meanRuntime;
      let startTime, endTime;
      self._resultMap = new Map();
      for(let n = parseInt(self._intervalMinInputCont.val()); n <= parseInt(self._intervalMaxInputCont.val()); n++){
        meanRuntime = 0;
        for(let j = 0; j < 100; j++){
          console.log("n=" + n + ", " + (j + 1) + "/100");
          cnfArray = generateCnf(n);
          let algorithm = new Algorithm(n, cnfArray);
          startTime = performance.now();
          algorithm.algorithmFrontEnd();
          endTime = performance.now();
          meanRuntime += endTime - startTime;
        }
        self._resultMap.set(n, (meanRuntime / 100).toFixed(4));
      }

      self._printResultMap();
      self._drawCharts();
    });
  }

  _printResultMap(){
    let text = "<tr><th>n</th><th>Átlagos idő</th></tr>";
    this._resultMap.forEach((value, key)=>{
      text += "<tr><td>n=" + key + "</td><td>" + value + "ms</td></tr>"
    });
    this._tableResultCont.html(text);
  }

  _drawCharts(){
    this._canvasRuntimeCont.find("canvas").remove();
    this._canvasRuntimeCont.append("<canvas class='test-canvas' height='100'></canvas>");
    let resultMapRuntimeKeyArray = [];
    let resultMapRuntimeValueArray = [];
    this._resultMap.forEach((value, key)=>{
      resultMapRuntimeKeyArray.push(key.toString());
      resultMapRuntimeValueArray.push(parseFloat(value));
    });
    new Chart(this._canvasRuntimeCont.find("canvas"), {
      type: 'bar',
      data: {
        labels: resultMapRuntimeKeyArray,
        datasets: [{
          label: "n",
          data: resultMapRuntimeValueArray,
          backgroundColor: "rgba(0, 0, 255, 1.0)",
        }]
      }
    });
  }
}
