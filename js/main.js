let size = 0;



const $random = document.querySelector('#random');

const $inputsContainer = document.querySelector('.inputs-container');

const $inputsCount = document.querySelector('#inputs-count');

const $out = document.querySelector('#out');

const $showValues = document.querySelector('#show-values');

const $calculation = document.querySelector('#calculation');

const makeElement = (tag, className, childrens = []) => {

  const el = document.createElement(tag);

  el.className = className;


  el.append(...childrens);


  return el;

};

const makeInput = () => {

  const el = makeElement('input', 'input');

  el.type = 'text';

  return el;

};

const createElements = (count, constructor) => {

  return Array(count).fill().map(constructor);

};

const showInputsText = () => {

  const inputs = $inputsContainer.querySelectorAll('input');

  const values = [...inputs].reduce((acc, element) => {

    return `${acc} ${element.value}`;

  }, '');

  $out.textContent = values;

};

$showValues.addEventListener('click', showInputsText);

$random.addEventListener('click', () => {

  const count = parseInt($inputsCount.value);

  for (let i = 0; i < count; i++) {
    const inputs = createElements(count, makeInput);

    let $label = document.createElement("label");

    size++;

    const $row = makeElement('div', 'mb-2', inputs);

    $inputsContainer.append($row);
  }
});


const getArray = () => {


  let arr1 = [];
  let array = [];

  const $mb2 = document.querySelectorAll('.mb-2');

  for (let i = 0; i < $mb2.length; i++) {

    const child = $mb2[i].childNodes;

    for (let j = 0; j < child.length; j++) {

      arr1.push(parseInt(child[j].value));

    }

    array.push(arr1);

    arr1 = [];

  }

  return array;
}

const calculat = () => {

  let matrix = getArray();
  let shortestMatrix = getShortestPathMatrix(matrix);
  showShortestPathMatrix(shortestMatrix);
}

$calculation.addEventListener('click', calculat);

//матрица кратчайших путей
function getShortestPathMatrix(matrix) {
  let SPMatrix = matrix;
  let maxV = 1000;
  let V = SPMatrix.length

  for (let i = 0; i < V; i++) {//обнуляем диагональ
    SPMatrix[i][i] = 0;
  }

  for (let k = 0; k < V; k++)
    for (let i = 0; i < V; i++)
      for (let j = 0; j < V; j++)
        if (SPMatrix[i][k] && SPMatrix[k][j] && i !== j)
          if (SPMatrix[i][k] + SPMatrix[k][j] < SPMatrix[i][j] || SPMatrix[i][j] === 0)
            SPMatrix[i][j] = SPMatrix[i][k] + SPMatrix[k][j];

  let array = getArray();
  let matrSmej = new Array(size);
  for (let i = 0; i < size; i++) {
    matrSmej[i] = new Array(size);
  }

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      matrSmej[i][j] = 0;
    }
  }

  for (let i = 0; i < array.length; i++) {
    for (let j = 0; j < array[i].length; j++) {
      matrSmej[array[i][j] - 1][i] = 1;
    }
  }

  if (checkForContours(matrSmej, matrSmej.length)) {
    document.writeln("В графе есть цыклы!");

  } else {

    let notUsedV = [];
    let topologiesArray = [];
    let reachabilityMatrix = getReachabilityMatrix(array);
    let sizeTopologiesArray = 0;


    for (let i = 0; i < array.length; i++) {
      notUsedV.push(i);
    }

    while (notUsedV.length !== 0) {
      let achievable = [];  //достяжимые R
      let contrAchievable = []; //контрдостяжимые Q

      for (let i = 0; i < reachabilityMatrix.length; i++) {
        if (reachabilityMatrix[notUsedV[0]][i] === 1) {
          achievable.push(i);
        }
        if (reachabilityMatrix[i][notUsedV[0]] === 1) {
          contrAchievable.push(i);
        }
      }

      let intersection = achievable.filter(value => contrAchievable.includes(value));

      topologiesArray[sizeTopologiesArray] = [];

      if (intersection.length !== 0) {


        topologiesArray[sizeTopologiesArray].push(intersection);
        console.log(intersection);

        for (let i = 0; i < intersection.length; i++) {
          notUsedV.splice(intersection[i], 1);
        }

      } else {
        topologiesArray[sizeTopologiesArray].push(notUsedV[0]);
        notUsedV.splice(0, 1);
      }

      sizeTopologiesArray++;

    }

    showLeftIncidentMatrix(array);

    let str1 = 'Топологическая декомпозиция' + '<br>';

    for (let i = 0; i < topologiesArray.length; i++) {

      str1 += 'Сильный связанный подграф (' + i + ')={';
      for (let j = 0; j < topologiesArray[i].length; j++) {
        if (j !== topologiesArray[i].length - 1) {
          str1 += (topologiesArray[i][j] + 1) + ',';
        } else str1 += '(' + (topologiesArray[i][j]) + ')';

      }

      str1 += '}' + '<br>';
    }


    return SPMatrix;
  }


  function getShortestPathMatrix(VesovMatrix, n){

    let matrix = VesovMatrix;

    for (let i=0; i<n; i++)
      matrix[i][i]=0;

    for (let k=0; k<n; k++){
      for (let i=0; i<n; i++){
        for (let j=0; j<n; j++){
          if (matrix[i][k] && matrix[k][j] && i!==j){
            if (matrix[i][k]+matrix[k][j] < matrix[i][j] || matrix[i][j]===0)
              matrix[i][j]=matrix[i][k]+matrix[k][j];
          }
        }
      }
    }
    return matrix;
  }

  function showShortestPathMatrix(matrix) {
    let str = "Матрица кратчайших путей" + '<br>';
    for (let i = 0; i < matrix.length; i++) {
      for (let j = 0; j < matrix.length; j++) {
        if (matrix[i][j] === 0) {
          matrix[i][j] = "\u221E";
        }
      }
    }

    for (let i = 0; i < matrix.length; i++) {
      str += "[";
      for (let j = 0; j < matrix.length; j++) {

        if (j !== matrix[i].length - 1) {
          str += matrix[i][j] + ',';
        } else str += matrix[i][j] + ']';

      }

      str1 += '<br>';
      document.writeln(str1);

    }
  }


  $calculation.addEventListener('click', calculat);


//показать множиство левых инциденций
  function showLeftIncidentMatrix(leftInc) {
    let str = 'Множество левых инциденций' + '<br>';

    for (let i = 0; i < leftInc.length; i++) {

      str += 'G+(' + (i + 1) + ')' + '={';

      if (leftInc[i].length === 0) {
        str += '';
      } else
        for (let j = 0; j < leftInc[i].length; j++) {
          if (leftInc[i][j] !== undefined) {
            if (j !== leftInc[i].length - 1) {
              str += (leftInc[i][j] + 1) + ',';
            } else str += (leftInc[i][j] + 1) + ')';
          }

        }
      str += "<br>";
    }
    document.writeln(str);
  }


//взять матрицу достяимости
  function getReachabilityMatrix(array) {
    let reachabilityMatrix = array;
    for (let k = 0; k < array.length; k++) {
      for (let i = 0; i < array.length; i++) {
        for (let j = 0; j < array.length; j++) {
          if (array[i][j] === 0) {
            if (array[k][j] === 1 && array[i][k] === 1) {
              array[i][j] = 1;
            }
          }
        }
      }
    }
    return reachabilityMatrix;
  }

//проверить на контуры
  function checkForContours(adjacencyMatrix, matrixSize) {
    for (let row = 0; row < matrixSize; row++) {
      for (let column = 0; column < matrixSize; column++) {
        if (adjacencyMatrix[row][column] === '1') {
          let path = getPath(adjacencyMatrix, matrixSize, row, column)
          if (path === null) {
            return true
          }
        }
      }
    }
    return false
  }


// Получить путь в графе
  function getPath(adjacencyMatrix, matrixSize, firstRow, firstColumn) {
    let vertices = []
    vertices.push(firstRow + 1, firstColumn + 1)

    // console.log("firstColumn")
    // console.log(firstColumn)
    let row = firstColumn
    for (let column = 0; column < matrixSize; column++) {
      if (adjacencyMatrix[row][column] === '1') {
        // console.log(row)
        // console.log(column)
        let el = column
        vertices.push(++el)
        // если в массиве вершин есть повторяющиеся элементы (то есть появился контур) возвращаем null
        if (hasDuplicates(vertices)) {
          return null
        } else {
          row = column
          column = -1
        }
      }
    }
    return vertices
  }


  function hasDuplicates(arr) {
    // console.log(arr)
    arr.sort();
    // console.log("Отсортированный массив вершин")
    // console.log(arr)

    for (let i = 0; i < arr.length; i++) {
      let index = i;
      if (arr[i] === arr[++index]) {
        return true
      }
    }
    return false
  }
}







