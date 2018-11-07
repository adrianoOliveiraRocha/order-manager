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
  var uf = `
  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço R$</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" placeholder="Preço" id="price" name="price"
      onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>
  <!-- small price  -->
  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço Pequeno R$</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" placeholder="Preço Pequeno" id="small_price" name="small_price"
      onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>
  <!-- large price  -->
  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço Grande R$</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" placeholder="Preço Grande" id="large_price" name="large_price"
      onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>
  <!-- promotional price  -->
  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço Promocional R$</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" placeholder="Preço Promocional" id="price" name="promotional_price"
      onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>
  `;

  var mf = `
  <div id='receiveAdd' class="row">

  </div>
  
  <div class="row">
    
    <div class="col-sm-2">
      <input type="button" class="form-control btn-success" 
      value="Adicionar" onclick='add();'>
    </div>    

  </div>
  <hr>  
  `;

  if (value == 1) {
    document.getElementById('uniqueFlavor').innerHTML = uf;
    document.getElementById('moreFlavor').innerHTML = '';
    
  } else if(value == 0){
    document.getElementById('uniqueFlavor').innerHTML = '';
    document.getElementById('moreFlavor').innerHTML = mf;
  }
  
}

function add() {
  var qfform = `
  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Quantidade de Sabores</label>
    </div>
    <div class="col-sm-3">
      <input type="number" class="form-control" 
      placeholder="Quantidade de Sabores" name="qf">
    </div>
  </div>
  <hr>

  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" 
      placeholder="Preço" name="priceqf" onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>

  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço Pequeno</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" 
      placeholder="Preço Pequeno" name="small_priceqf" onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>

  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço Grande</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" 
      placeholder="Preço Grande" name="large_priceqf" onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>

  <div class="row">
    <div class="col-sm-3" style="text-align: center">
      <label class="form-control">Preço Promocional</label>
    </div>
    <div class="col-sm-3">
      <input type="text" class="form-control" 
      placeholder="Preço Promocional" name="promotional_priceqf" onkeyup="replacePoint(this);">
    </div>
  </div>
  <hr>
  `;

  var receiveAdd = document.getElementById('receiveAdd');
  
  if (receiveAdd.childElementCount > 0) {

    qfform = qfform.replace("qf", "qf" + receiveAdd.childElementCount);
    qfform = qfform.replace("priceqf", "priceqf" + receiveAdd.childElementCount);
    qfform = qfform.replace("small_priceqf", "small_priceqf" + receiveAdd.childElementCount);
    qfform = qfform.replace("large_priceqf", "large_priceqf" + receiveAdd.childElementCount);
    qfform = qfform.replace("promotional_priceqf", "promotional_priceqf" + receiveAdd.childElementCount);
    
  }
  var el = document.createElement('div');
  el.innerHTML = qfform;
  receiveAdd.appendChild(el);

}