class DemoUI{
  constructor(variableNumInputCont, cnfTextInputCont, modelOutputCont, visualizerOutputCont, startAlgorithmButton){
    this._variableNumInputCont = variableNumInputCont;
    this._cnfTextInputCont = cnfTextInputCont;
    this._modelOutputCont = modelOutputCont;
    this._visualizerOutputCont = visualizerOutputCont;
    this._startAlgorithmButton = startAlgorithmButton;
  }

  setAction(){
    let self = this;
    this._startAlgorithmButton.on("click", function(){
      let cnfArray = self._cnfParse(self._cnfTextInputCont.val());
      let algorithm = new Algorithm(parseInt(self._variableNumInputCont.val()), cnfArray);

      let allActualModel = algorithm.convertModelSetToActual(algorithm.startAlgorithm());
      self._printAllModel(allActualModel);
      self._modelVisualizer(cnfArray, allActualModel);
    });
  }

  _cnfParse(inputText){
    let splitTextArray = inputText.split(" ");
    let finalTextArray = [];
    let tempTextArray = [], tempClause = [], tempLiteral;
    let cnf = [];

    for(let i = 0; i < splitTextArray.length; i++){
      tempTextArray = splitTextArray[i].split("\n")
      for(let j = 0; j < tempTextArray.length; j++)
        finalTextArray.push(tempTextArray[j]);
    }

    for(let i = 0; i < finalTextArray.length; i++){
      tempLiteral = parseInt(finalTextArray[i]);
      if(tempLiteral == 0){
        cnf.push(tempClause);
        tempClause = [];
      } else {
        tempClause.push(tempLiteral);
      }
    }

    return cnf;
  }

  _printAllModel(allModel){
    let text = "";
    for(let i = 0; i < allModel.length; i++){
      text += (i + 1) + ". értékadás: ";
      for(let j = 0; j < allModel[i].length; j++){
        text += "p<span class='low-index'>" + (j + 1) + "</span>&#8594;" + allModel[i][j];
        if(j < allModel[i].length - 1)
          text += ", ";
      }
      if(i < allModel.length - 1)
        text += "</br>";
    }

    this._modelOutputCont.html(text);
  }

  _modelVisualizer(cnfArray, allModel){
    let text = "", colorClass, assignment, isModel;
    for(let i = 0; i < allModel.length; i++){
      text += (i + 1) + ". értékadás: {";
      for(let j = 0; j < cnfArray.length; j++){
        text += "{";
        for(let k = 0; k < cnfArray[j].length; k++){
          assignment = allModel[i][Math.abs(cnfArray[j][k]) - 1];
          if(cnfArray[j][k] > 0){
            colorClass = assignment == 1 ? "color-green" : "color-red";
            text += "<span class='" + colorClass + "'>p<span class='low-index'>" + cnfArray[j][k] + "</span></span>";
          } else {
            colorClass = assignment == 0 ? "color-green" : "color-red";
            text += "<span class='" + colorClass + "'>&#172;p<span class='low-index'>" + cnfArray[j][k] * (-1) + "</span></span>";
          }

          if(k < cnfArray[j].length - 1)
            text += ",";
        }
        text += "}";
      }
      text += "}";

      isModel = Algorithm.checkIfModel(cnfArray, allModel[i]);

      if(isModel){
        text += ", ellenőrzés: <span style='color: green'>&#10003;</span>";
      } else {
        text += ", ellenőrzés: <span style='color: red'>&#10005;</span>";
      }

      text += "</br>";
    }

    this._visualizerOutputCont.html(text);
  }
}
