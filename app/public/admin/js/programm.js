function replacePoint(element) {
  element.value = element.value.replace(",", ".");
}

/** 
 * These functions is related to products that have more than one flavor
 * please don't change nothing here
 */
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
      value="Adicionar Preço" onclick='add();'>
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

function changeUniqueFlavor(value) {
  if (value == 1) {
    var editPrice = document.getElementById('editPrice');
    editPrice.remove();  
    
    //to put others fields
    const myFields = `
    <!-- price  -->
    <div class="row">
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço R$</label>
      </div>
      <div class="col-sm-3">
        <input type="text" class="form-control" placeholder="Preço" id="price" 
        name="price" onkeyup="replacePoint(this);"/>
      </div>
    </div>
    <hr>
    <!-- small price  -->
    <div class="row">
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço Pequeno R$</label>
      </div>
      <div class="col-sm-3">
        <input type="text" class="form-control" placeholder="Preço Pequeno" 
        id="small_price" name="small_price" onkeyup="replacePoint(this);">
      </div>
    </div>
    <hr>
    <!-- large price  -->
    <div class="row">
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço Grande R$</label>
      </div>
      <div class="col-sm-3">
        <input type="text" class="form-control" placeholder="Preço Grande" 
        id="large_price" name="large_price" onkeyup="replacePoint(this);">
      </div>
    </div>
    <hr>
    <!-- promotional price  -->
    <div class="row">
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço Promocional R$</label>
      </div>
      <div class="col-sm-3">
        <input type="text" class="form-control" placeholder="Preço Promocional" 
        id="price" name="promotional_price" onkeyup="replacePoint(this);">
      </div>
    </div>
    <hr>                   
    `;
    document.getElementById('uniqueFlavor').innerHTML = myFields;
    
  } else { // 0 it have not unique flavor
    var buttons = document.getElementById('buttons');
    var div = document.createElement('div');
    div.id = 'editPrice';
    const idProduct = document.getElementById('idProduct').value;
    const content = `<div class="col-sm-2" style="text-align: center">
                        <a class="form-control btn btn-warning"
                        href="/show_prices?idProduct=` + idProduct + `">
                          Editar Preços
                        </a>
                      </div>`;
    div.innerHTML = content;
    buttons.appendChild(div);
    document.getElementById('uniqueFlavor').innerHTML = '';
    //to delete others fields
  }
}

function newPF() {
  const idProduto = document.getElementById('idProduto').value;
  var form = `
  <form action="/salvar_pf" method="POST">
    
    <hr>
    <div class="row">
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Quantidade de sabores</label>
      </div>
      <div class="col-sm-2">
        <input type="text" class="form-control" placeholder="Quantidade de Sabores" 
        name="amount_flavor">
      </div>
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço R$</label>
      </div>
      <div class="col-sm-2">
        <input type="text" class="form-control" placeholder="Preço" 
        name="price" onkeyup="replacePoint(this);">
      </div>
    </div>
    <hr>   

    <div class="row">
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço Pequeno R$</label>
      </div>
      <div class="col-sm-2">
        <input type="text" class="form-control" placeholder="Preço Pequeno" 
        name="small_price" onkeyup="replacePoint(this);">
      </div>
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço Grande R$</label>
      </div>
      <div class="col-sm-2">
        <input type="text" class="form-control" placeholder="Preço Grande" 
        name="large_price" onkeyup="replacePoint(this);">
      </div>
    </div>
    <hr>
    
    <div class="row">
      <div class="col-sm-3" style="text-align: center">
        <label class="form-control">Preço Promocional R$</label>
      </div>
      <div class="col-sm-2">
        <input type="text" class="form-control" placeholder="Preço Promocional" 
        name="promotional_price" onkeyup="replacePoint(this);">
      </div>                    
    </div>
    <hr>
    <input type="hidden" name='idProduto' value="`+ idProduto +`">
    <div class="row">                    
      <div class="col-sm-2" style="text-align: center">
        <input class="form-control btn btn-primary" type="submit" value="Salvar" />
      </div>
      <div class="col-sm-2" style="text-align: center">
        <input class="form-control btn btn-warning" onclick='cancelPF(this);' 
        type='button' value='Cancelar'/>
      </div>            
    </div>
    <hr>
    
  </form>
  `;

  var newForms = document.getElementById('newForms');
  var div = document.createElement('div');
  div.innerHTML = form;
  newForms.appendChild(div);
  
}

function cancelPF(element) {
  var div = element.parentNode.parentNode.parentNode.parentNode;
  div.remove();
}

/** End to functions relacted to products that have 
 * more than one flavor 
 */

// ------------------------**------------------------**------------------------ //

 /** 
  * From now here I have functions related to products that have one flavor. 
  * Please take care with this :-(
  */