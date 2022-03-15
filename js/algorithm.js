class Algorithm{
  constructor(variableNum, cnfArray){
    this._variableNum = variableNum;
    this._cnfArray = cnfArray;
    this._usedVariables = new Set();

    this._usedClauses = [];
    for(let i = 0; i < this._cnfArray.length; i++)
      this._usedClauses.push(0);

    this._clauseOrder = [];
    for(let i = 0; i < this._cnfArray.length; i++)
      this._clauseOrder.push(this._findBestClause());

    this._clauseModelSet = [];
    for(let i = 0; i < this._cnfArray.length; i++)
      this._clauseModelSet.push(this._generateAllModelSet(this._cnfArray[i]));
  }

  algorithmFrontEnd(){
    let startModelSet = [];
    for(let i = 0; i < this._variableNum; i++)
      startModelSet.push(-1);

    let firstClauseIndex = this._clauseOrder[0];
    let allModelSet = this._clauseModelSet[firstClauseIndex];
    let result;
    for(let i = 0; i < allModelSet.length; i++){
      result = this._algorithm(startModelSet, allModelSet[i], 1);
      if(result !== false)
        return result;
    }

    return false;
  }

  _algorithm(currentModelSet, nextModelSet, depth){
    if(!this._isMatching(currentModelSet, nextModelSet))
      return false;

    let actualModelSet = this._intersection(currentModelSet, nextModelSet);

    if(depth == this._cnfArray.length)
      return actualModelSet;

    let currentClauseIndex = this._clauseOrder[depth];
    let allModelSet = this._clauseModelSet[currentClauseIndex];
    let result;
    for(let i = 0; i < allModelSet.length; i++){
      result = this._algorithm(actualModelSet, allModelSet[i], depth + 1);
      if(result !== false)
        return result;
    }

    return false;
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
