$(document).ready(function(){
  $(".js-start").on("click", startAlgorithm);

  function startAlgorithm(){
    let inputText = $(".js-cnf-input").val();
    let variableNum = parseInt($(".js-variable-num").val());

    let splitTextArray = inputText.split(" ");
    let finalTextArray = [];
    let tempTextArray = [];
    for(let i = 0; i < splitTextArray.length; i++){
      tempTextArray = splitTextArray[i].split("\n")
      for(let j = 0; j < tempTextArray.length; j++){
        finalTextArray.push(tempTextArray[j]);
      }
    }

    let cnf = [], tempClause = [], tempLiteral;
    for(let i = 0; i < finalTextArray.length; i++){
      tempLiteral = parseInt(finalTextArray[i]);
      if(tempLiteral == 0){
        cnf.push(tempClause);
        tempClause = [];
      } else {
        tempClause.push(tempLiteral);
      }
    }

    let finalModelSet = [[]];
    for(let i = 0; i < variableNum; i++){
      finalModelSet[0].push(-1);
    }
    let tempModelSet = [];
    let resultModelSet = [];
    let finalModelActual = [];
    let usedVariables = new Set();
    for(let i = 0; i < cnf.length; i++){
      for(let j = 0; j < cnf[i].length; j++){
        usedVariables.add(Math.abs(cnf[i][j]));
      }
      tempModelSet = generateAllModelSet(cnf[i]);
      console.log("klóz modelljei: ");
      console.log(tempModelSet);
      resultModelSet = [];

      for(let j = 0; j < tempModelSet.length; j++){
        for(let k = 0; k < finalModelSet.length; k++){
          if(isMatching(tempModelSet[j], finalModelSet[k])){
            resultModelSet.push(intersection(tempModelSet[j], finalModelSet[k]));
          }
        }
      }

      finalModelSet = resultModelSet;
      console.log("F: ");
      console.log(finalModelSet);
    }

    if(finalModelSet.length == 0){
      $(".js-print-all_model").text("Kielégíthetetlen");
      $(".js-model-visualizer").text("Kielégíthetetlen");
      return false;
    }

    finalModelActual = convertModelSetToActual(finalModelSet);

    printCnf(cnf);
    printAllModel(finalModelActual);
    modelVisualizer(cnf, finalModelActual);

    function intersection(modelSetOne, modelSetTwo){
      let intersectionModelSet = [];

      for(let i = 0; i < modelSetOne.length; i++){
        if(modelSetOne[i] == 1 || modelSetTwo[i] == 1){
          intersectionModelSet.push(1);
        } else if(modelSetOne[i] == 0 || modelSetTwo[i] == 0){
          intersectionModelSet.push(0);
        } else {
          intersectionModelSet.push(-1);
        }
      }

      return intersectionModelSet;
    }

    function isMatching(modelSetOne, modelSetTwo){
      for(let i = 0; i < modelSetOne.length; i++){
        if((modelSetOne[i] == 1 && modelSetTwo[i] == 0) || (modelSetOne[i] == 0 && modelSetTwo[i] == 1)){
          return false;
        }
      }

      return true;
    }

    function generateAllModelSet(clause){
      let falseInterpretation = [];
      let positiveIndex, negativeIndex;
      for(let k = 1; k < variableNum + 1; k++){
        positiveIndex = clause.indexOf(k);
        negativeIndex = clause.indexOf(k * (-1));
        if(positiveIndex >= 0){
          falseInterpretation.push(0);
          continue;
        } else if(negativeIndex >= 0){
          falseInterpretation.push(1);
          continue;
        } else {
          falseInterpretation.push(-1);
        }
      }

      let allModelSet = [], tempArray;
      let currentVariableIndex, foundVariableIndex;
      currentVariableIndex = 1;
      for(let i = 0; i < clause.length; i++){
        tempArray = [];
        foundVariableIndex = 0;
        for(let j = 0; j < falseInterpretation.length; j++){
          if(falseInterpretation[j] >= 0){
            foundVariableIndex++;

            if(foundVariableIndex == currentVariableIndex){
              tempArray.push(negate(falseInterpretation[j]));
            } else if(foundVariableIndex > currentVariableIndex){
              tempArray.push(-1);
            } else if(foundVariableIndex < currentVariableIndex){
              tempArray.push(falseInterpretation[j]);
            }
          } else {
            tempArray.push(-1);
          }
        }

        currentVariableIndex++;
        allModelSet.push(tempArray);
      }

      return allModelSet;
    }

    function negate(val){
      return val == 1 ? 0 : 1;
    }

    function convertModelSetToActual(modelSet){
      let modelActual = [];

      for(let i = 0; i < modelSet.length; i++){
        getAllModel(modelActual, modelSet[i]);
      }

      return modelActual;
    }

	/*This is not part of the algorithm, its only purpose is to extract all the interpretations from the model sets*/
    function getAllModel(modelActual, modelSet){
      let indexOf = modelSet.indexOf(-1);
      if(indexOf < 0){
        modelActual.push(modelSet);
      } else {
        let newModelSetOne = [];
        for(let i = 0; i < modelSet.length; i++){
          newModelSetOne[i] = indexOf == i ? 0 : modelSet[i];
        }
        getAllModel(modelActual, newModelSetOne);

        let newModelSetTwo = [];
        for(let i = 0; i < modelSet.length; i++){
          newModelSetTwo[i] = indexOf == i ? 1 : modelSet[i];
        }
        getAllModel(modelActual, newModelSetTwo);
      }
    }

    function printCnf(cnf){
      let text = "{";
      for(let i = 0; i < cnf.length; i++){
        text += "{";
        for(let j = 0; j < cnf[i].length; j++){
          if(cnf[i][j] > 0){
            text += "p<span class='low-index'>" + cnf[i][j] + "</span>";
          } else {
            text += "&#172;p<span class='low-index'>" + cnf[i][j] * (-1) + "</span>";
          }

          if(j < cnf[i].length - 1){
            text += ",";
          }
        }
        text += "}";
      }
      text += "}";

      $(".js-print-cnf").html(text);
    }

    function printAllModel(finalModel){
      let text = "";
      for(let i = 0; i < finalModel.length; i++){
        text += (i + 1) + ". értékadás: ";
        for(let j = 0; j < finalModel[i].length; j++){
          text += "p<span class='low-index'>" + (j + 1) + "</span>&#8594;" + finalModel[i][j];
          if(j < finalModel[i].length - 1){
            text += ", ";
          }
        }
        if(i < finalModel.length - 1){
          text += "</br>";
        }
      }

      $(".js-print-all_model").html(text);
    }

    function modelVisualizer(cnf, finalModel){
      let text = "", colorClass, assignment, isModel;
      for(let i = 0; i < finalModel.length; i++){
        text += (i + 1) + ". értékadás: {";
        for(let j = 0; j < cnf.length; j++){
          text += "{";
          for(let k = 0; k < cnf[j].length; k++){
            assignment = finalModel[i][Math.abs(cnf[j][k]) - 1];
            if(cnf[j][k] > 0){
              colorClass = assignment == 1 ? "color-green" : "color-red";
              text += "<span class='" + colorClass + "'>p<span class='low-index'>" + cnf[j][k] + "</span></span>";
            } else {
              colorClass = assignment == 0 ? "color-green" : "color-red";
              text += "<span class='" + colorClass + "'>&#172;p<span class='low-index'>" + cnf[j][k] * (-1) + "</span></span>";
            }

            if(k < cnf[j].length - 1){
              text += ",";
            }
          }
          text += "}";
        }
        text += "}";

        isModel = checkIfModel(cnf, finalModel[i]);

        if(isModel){
          text += ", ellenőrzés: <span style='color: green'>&#10003;</span>";
        } else {
          text += ", ellenőrzés: <span style='color: red'>&#10005;</span>";
        }

        text += "</br>";
      }

      $(".js-model-visualizer").html(text);
    }

    function checkIfModel(cnf, model){
      let isModel, currentLiteral, assignment;
      for(let i = 0; i < cnf.length; i++){
        isModel = false;
        for(let j = 0; j < cnf[i].length; j++){
          currentLiteral = cnf[i][j];
          assignment = model[Math.abs(currentLiteral) - 1];
          if((currentLiteral > 0 && assignment == 1) || (currentLiteral < 0 && assignment == 0)){
            isModel = true;
            continue;
          }
        }

        if(!isModel){
          return false;
        }
      }

      return true;
    }
  }
});
