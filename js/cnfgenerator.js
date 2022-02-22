function generateCnf(n){
  let clauseNum = n * 4;
  let cnfArray = [];
  let currentClauseVariables, currentClauseActual;
  let creatingClause;
  for(let i = 0; i < clauseNum; i++){
    currentClauseVariables = new Set();
    creatingClause = true;
    while(creatingClause){
      while(currentClauseVariables.size < 3)
        currentClauseVariables.add(Math.floor((Math.random() * n) + 1));

      currentClauseActual = Array.from(currentClauseVariables);
      for(let j = 0; j < currentClauseActual.length; j++)
        currentClauseActual[j] = Math.random() < 0.5 ? currentClauseActual[j] * (-1) : currentClauseActual[j];

      if(checkIfAlreadyExists(cnfArray, currentClauseActual))
        continue;

      cnfArray.push(currentClauseActual);
      creatingClause = false;
    }
  }

  return cnfArray;
}

function checkIfAlreadyExists(cnfArray, currentClauseVariables){
  let exist;
  let clauseSetCnf, clauseSetCurrent;

  for(let i = 0; i < cnfArray.length; i++){
    exist = true;
    clauseSetCnf = new Set(cnfArray[i]);
    clauseSetCurrent = new Set(currentClauseVariables);
    clauseSetCurrent.forEach((value) => {
      if(!clauseSetCnf.has(value))
        exist = false;
    });

    if(exist)
      return true;
  }

  return false;
}
