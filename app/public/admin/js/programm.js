function clearUnits() {
  document.getElementById('quantity').value = '';
  document.getElementById('color').value = '';
  document.getElementById('size').value = '';
}

function saveUnits() {
  var contentUnit = document.getElementById('contentUnit'); //table
  var content = contentUnit.innerHTML;
  let quantity = document.getElementById('quantity').value;
  let color = document.getElementById('color').value;
  let size = document.getElementById('size').value;
  let rows = contentUnit.rows;
  // define id of rows
  var count = 0;  
  for(let row of rows){
    count ++;
  } 

  response = `
  <tr id='${count}' style='text-align: center;'>
    <td>${msgQuantity(quantity)}</td>
    <td>
    <ul><li style='background: ${color}; list-style-type:none;'>${color}</li></ul>
    </td>
    <td>Tamanho ${size}</td>
    <td><input type="button" class="form-control btn btn-info" value="Editar"></td>
    <td><input type="button" class="form-control btn btn-danger" value="Excluir"></td>
  </tr>
  `;
  
  contentUnit.innerHTML = response + content;

}

function msgQuantity(quantity) {
  quantity = parseInt(quantity);
  if (quantity === 1) {
    return `${quantity} unidade`;
  } else if (quantity > 1) {
    return `${quantity} unidades`;
  }
}

function replacePoint(element) {
  element.value = element.value.replace(",", ".");
}

function uniqueFlavor(value) {
  
  if (value == 1) {
    document.getElementById('uniqueFlavor').style.visibility = 'visible';
    document.getElementById('moreFlavor').style.visibility = 'hidden';
  } else if(value == 0){
    document.getElementById('uniqueFlavor').style.visibility = 'hidden';
    document.getElementById('moreFlavor').style.visibility = 'visible';
  }
  
}