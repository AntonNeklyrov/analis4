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
function getShortestPathMatrix(matrix){
  let SPMatrix = matrix;
  let maxV = 1000;
  let V = SPMatrix.length

  for (let i = 0; i < V; i++) {//обнуляем диагональ
    SPMatrix[i][i] = 0;
  }

  for (let k = 0; k < V; k++) {
    for (let i = 0; i < V; i++) {
      for (let j = 0; j < V; j++) {
        if (SPMatrix[i][k] && SPMatrix[k][j] && i !== j) {
          if (SPMatrix[i][k] + SPMatrix[k][j] < SPMatrix[i][j] || SPMatrix[i][j] === 0)
            SPMatrix[i][j] = SPMatrix[i][k] + SPMatrix[k][j];
        }
      }
    }
  }

  return SPMatrix;
}

function showShortestPathMatrix(matrix) {
  let str = "Матрица кратчайших путей" + '<br>';
  for(let i = 0; i < matrix.length ;i++){
    for(let j = 0; j < matrix.length; j++){
      if(matrix[i][j] === 0){
        matrix[i][j] = "\u221E";
      }
    }
  }

  for (let i = 0; i < matrix.length; i++) {
    str += "[";
    for (let j = 0; j < matrix.length; j++) {

      if (j !== matrix[i].length - 1) {
        str += matrix[i][j]  + ',';
      } else str += matrix[i][j]  + ']';

    }
    str += "<br>";
  }
  document.writeln(str);
}

function getR(matrix) {
  let sum = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix.length; j++) {
      sum += matrix[i][j];
    }
  }
  let m = 0.5 * sum;
  return (m / (matrix.length - 1)) - 1;
}

function getUnevenness(matrix) {
  let size = matrix.length;
  let edge = getEdge(matrix);
  let avg = 2 * edge / size;
  let degree = getDegreeMatrix(matrix);
  let unevenness = 0;

  for (let i = 0; i < size; i++) {
    unevenness += Math.pow(degree[i] - avg, 2);
  }

  return unevenness;
}


function getEdge(matrix) {
  let length = matrix.length;
  let edge = 0;
  for (let i = 0; i < length; i++) {
    for (let j = 0; j < length; j++) {
      if (matrix[i][j] === 1) {
        edge++;
      }
    }
  }
  return edge / 2;
}

function getDegreeMatrix(matrix) {
  let degreeMatrix = [];

  for (let i = 0; i < matrix.length; i++) {
    let degreeLength = 0;
    for (let j = 0; j < matrix.length; j++) {
      if (matrix[i][j] === 1) {
        degreeLength++;
      }
    }
    degreeMatrix.push(degreeLength);
  }
  return degreeMatrix;
}



