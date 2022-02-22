class Algorithm{
  constructor(variableNum, cnfArray, isHeuristic = true){
    this._variableNum = variableNum;
    this._cnfArray = cnfArray;
    this._isHeuristic = isHeuristic;
    this._tempModelSet = [];
    this._resultModelSet = [];
    this._finalModelSet = [[]];
    for(let i = 0; i < this._variableNum; i++)
      this._finalModelSet[0].push(-1);

    this._usedVariables = new Set();
    this._usedClauses = [];
    for(let i = 0; i < this._cnfArray.length; i++)
      this._usedClauses.push(0);

    /*even index: nth positive literal occurences
    odd index: nth negative literal occurences*/
    this._literalOccurrences = [];
    for(let i = 0; i < variableNum * 2; i++)
      this._literalOccurrences.push(0);
  }

  startAlgorithm(){
    let bestClause;
    for(let i = 0; i < this._cnfArray.length; i++){
      bestClause = this._isHeuristic ? this._findBestClause() : i;
      this._tempModelSet = this._generateAllModelSet(this._cnfArray[bestClause]);

      for(let j = 0; j < this._tempModelSet.length; j++){
        for(let k = 0; k < this._finalModelSet.length; k++){
          if(this._isMatching(this._tempModelSet[j], this._finalModelSet[k]))
            this._resultModelSet.push(this._intersection(this._tempModelSet[j], this._finalModelSet[k]));
        }
      }

      this._finalModelSet = this._resultModelSet;
      this._countOccurences(this._finalModelSet);
      this._resultModelSet = [];
    }

    return this._finalModelSet;
  }

  _countOccurences(modelSet){
    for(let i = 0; i < this._literalOccurrences.length; i++)
      this._literalOccurrences[i] = 0;

    for(let i = 0; i < modelSet.length; i++){
      for(let j = 0; j < modelSet[i].length; j++){
        if(modelSet[i][j] == 1){
          this._literalOccurrences[j * 2]++;
        } else if(modelSet[i][j] == 0){
          this._literalOccurrences[(j * 2) + 1]++;
        }
      }
    }
  }

  _findBestClause(){
    let bestClause, bestSharedVariables, bestHeuristicValue = -1;
    let currentSharedVariables, currentHeuristicValue;
    let actualVariable;
    for(let i = 0; i < this._cnfArray.length; i++){
      if(this._usedClauses[i] == 0){
        currentSharedVariables = new Set();
        currentHeuristicValue = 0;
        for(let j = 0; j < this._cnfArray[i].length; j++){
          actualVariable = Math.abs(this._cnfArray[i][j]);
          if(this._usedVariables.has(actualVariable)){
            currentSharedVariables.add(actualVariable);
            currentHeuristicValue++;
          }
        }

        if(currentHeuristicValue > bestHeuristicValue){
          bestHeuristicValue = currentHeuristicValue;
          bestSharedVariables = new Set();
          currentSharedVariables.forEach((value) => {bestSharedVariables.add(value)});
          bestClause = i;
        }
      }
    }

    this._usedClauses[bestClause] = 1;
    for(let j = 0; j < this._cnfArray[bestClause].length; j++){
      this._usedVariables.add(Math.abs(this._cnfArray[bestClause][j]));
    }

    return bestClause;
  }

  _intersection(modelSetOne, modelSetTwo){
    let intersectionModelSet = [];
    let pushValue;

    for(let i = 0; i < modelSetOne.length; i++){
      if(modelSetOne[i] == 1 || modelSetTwo[i] == 1){
        pushValue = 1;
      } else if(modelSetOne[i] == 0 || modelSetTwo[i] == 0){
        pushValue = 0;
      } else {
        pushValue = -1;
      }
      intersectionModelSet.push(pushValue);
    }

    return intersectionModelSet;
  }

  _isMatching(modelSetOne, modelSetTwo){
    for(let i = 0; i < modelSetOne.length; i++){
      if((modelSetOne[i] == 1 && modelSetTwo[i] == 0) || (modelSetOne[i] == 0 && modelSetTwo[i] == 1))
        return false;
    }

    return true;
  }

  _generateAllModelSet(clause){
    let falseInterpretation = [];
    let positiveIndex, negativeIndex;
    let pushValue;
    for(let k = 1; k < this._variableNum + 1; k++){
      positiveIndex = clause.indexOf(k);
      negativeIndex = clause.indexOf(k * (-1));
      if(positiveIndex >= 0){
        pushValue = 0;
      } else if(negativeIndex >= 0){
        pushValue = 1;
      } else {
        pushValue = -1;
      }
      falseInterpretation.push(pushValue);
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
            pushValue = this._negate(falseInterpretation[j]);
          } else if(foundVariableIndex > currentVariableIndex){
            pushValue = -1;
          } else if(foundVariableIndex < currentVariableIndex){
            pushValue = falseInterpretation[j];
          }
        } else {
          pushValue = -1;
        }
        tempArray.push(pushValue);
      }

      currentVariableIndex++;
      allModelSet.push(tempArray);
    }

    return allModelSet;
  }

  _negate(val){
    return val == 1 ? 0 : 1;
  }

  convertModelSetToActual(){
    let modelActual = [];

    for(let i = 0; i < this._finalModelSet.length; i++)
      this._getAllModel(modelActual, this._finalModelSet[i]);

    return modelActual;
  }

  /*This is not part of the algorithm, its only purpose is to extract all the interpretations from the model sets*/
  _getAllModel(modelActual, modelSet){
    let indexOf = modelSet.indexOf(-1);
    if(indexOf < 0){
      modelActual.push(modelSet);
    } else {
      let newModelSetOne = [];
      for(let i = 0; i < modelSet.length; i++)
        newModelSetOne[i] = indexOf == i ? 0 : modelSet[i];
      this._getAllModel(modelActual, newModelSetOne);

      let newModelSetTwo = [];
      for(let i = 0; i < modelSet.length; i++)
        newModelSetTwo[i] = indexOf == i ? 1 : modelSet[i];
      this._getAllModel(modelActual, newModelSetTwo);
    }
  }

  static checkIfModel(cnfArray, model){
    let isModel, currentLiteral, assignment;
    for(let i = 0; i < cnfArray.length; i++){
      isModel = false;
      for(let j = 0; j < cnfArray[i].length; j++){
        currentLiteral = cnfArray[i][j];
        assignment = model[Math.abs(currentLiteral) - 1];
        if((currentLiteral > 0 && assignment == 1) || (currentLiteral < 0 && assignment == 0)){
          isModel = true;
          continue;
        }
      }

      if(!isModel)
        return false;
    }

    return true;
  }
}
