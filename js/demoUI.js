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
      let model = algorithm.algorithmFrontEnd();
      self._printAllModel(model);
      self._modelVisualizer(cnfArray, model);
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

  _printAllModel(model){
    let text = "";
    if(model === false){
      text = "Kielégíthetetlen";
    } else {
      for(let i = 0; i < model.length; i++){
        if(model[i] >= 0){
          text += "p<span class='low-index'>" + (i + 1) + "</span>&#8594;" + model[i];
          if(i < model.length - 1)
            text += ", ";
        }
      }
    }

    this._modelOutputCont.html(text);
  }

  _modelVisualizer(cnfArray, model){
    let text = "", colorClass, assignment, isModel;
    if(model === false){
      text = "Kielégíthetetlen";
    } else {
      for(let i = 0; i < cnfArray.length; i++){
        text += "{";
        for(let j = 0; j < cnfArray[i].length; j++){
          assignment = model[Math.abs(cnfArray[i][j]) - 1];
          if(cnfArray[i][j] > 0){
            colorClass = assignment == 1 ? "color-green" : "color-red";
            text += "<span class='" + colorClass + "'>p<span class='low-index'>" + cnfArray[i][j] + "</span></span>";
          } else {
            colorClass = assignment == 0 ? "color-green" : "color-red";
            text += "<span class='" + colorClass + "'>&#172;p<span class='low-index'>" + cnfArray[i][j] * (-1) + "</span></span>";
          }

          if(j < cnfArray[i].length - 1)
            text += ",";
        }
        text += "}";
      }
      text += "}";

      isModel = Algorithm.checkIfModel(cnfArray, model);

      if(isModel){
        text += ", ellenőrzés: <span style='color: green'>&#10003;</span>";
      } else {
        text += ", ellenőrzés: <span style='color: red'>&#10005;</span>";
      }
    }

    this._visualizerOutputCont.html(text);
  }
}
