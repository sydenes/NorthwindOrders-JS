const url='http://localhost:3000';

//==================GET METHODS=====================================
async function GetEmployees(){
    const response=await fetch(url+"/employees");
    const employees=await response.json();
    return employees;
}

async function GetOrders(){
   const response=await fetch(url+"/orders");
   const orders=await response.json();
   const empList=await GetEmployees(); //await yazmadığımızda 'promise' döner ve hata alırız.
   CreateTable(orders,empList);
   return orders;
}
var ordersArr=GetOrders();

async function GetProducts(){
  const response=await fetch(url+"/products");
  const products=await response.json();
  return products;
}
var productsArr=GetProducts();
//==================================================================

//=================TABLE METHODS====================================

//********** Tablo Oluşturma**********
function CreateTable(array,empArr){
  const divElement=document.querySelector(".table");
  const tableElement=document.createElement("table");
  tableElement.setAttribute("border","1");
  const theadElement = document.createElement("thead");
  const tbodyElement = document.createElement("tbody");

  const tr=document.createElement("tr");

  const th1=document.querySelector('.th1');
  const th2=document.querySelector('.th2');
  const th3=document.querySelector('.th3');
  const th4=document.querySelector('.th4');
  const th5=document.querySelector('.th5');
  const th6=document.querySelector('.th6');

  tr.appendChild(th1);
  tr.appendChild(th2);
  tr.appendChild(th3);
  tr.appendChild(th4);
  tr.appendChild(th5);
  tr.appendChild(th6);
  theadElement.appendChild(tr);


  for (let i = 0; i < array.length; i++) {
      const order = array[i];
      const tr1=document.createElement("tr");

      const td1=document.createElement("td");
      td1.innerText=order.id;
      const td2=document.createElement("td");
      td2.innerText=order.customerId;
      
      const td3=document.createElement("td");
      const emp=empArr.find(x=>x.employeeId==order.employeeId);  //id'ye göre müşteriyi bulma
      td3.innerText=emp.firstName+' '+emp.lastName; 


      const td4=document.createElement("td");
      var startDate = order.orderDate;
      var convertedStartDate = new Date(startDate);
      var month = convertedStartDate.getMonth() + 1
      var day = convertedStartDate.getDay();
      var year = convertedStartDate.getFullYear();
      var shortStartDate = year+"/"+month + "/" + day ; //DateTime --to--> ShortDate
      td4.innerText=shortStartDate;

      let detail=order.details;
      let totalPrice=0;
      detail.forEach(dtl => {
          totalPrice+=(dtl.unitPrice*dtl.quantity*(1-dtl.discount)); //TotalPrice
      });
      const td5=document.createElement("td");
      //td5.innerText=Math.round(totalPrice*100)/100;
      td5.innerText=totalPrice.toFixed(2);

      const td6=document.createElement("button");
      td6.innerText='Detay...';
      td6.setAttribute('id',order.id);//*
      td6.classList.add('dtl-btn')
      td6.addEventListener("click", btnFunc); //Oluşturulan her detay butonuna 'click' event atama
      function btnFunc() {
        document.getElementById("oid").style.visibility = "visible";
        const pnlId=document.querySelector('.pnl-id');
        pnlId.innerText=order.id;
        FillDetails(order.id);
      }

      tr1.appendChild(td1);
      tr1.appendChild(td2);
      tr1.appendChild(td3);
      tr1.appendChild(td4);
      tr1.appendChild(td5);
      tr1.appendChild(td6);

      tbodyElement.appendChild(tr1);
  }

  tableElement.appendChild(theadElement);
  tableElement.appendChild(tbodyElement);

  divElement.appendChild(tableElement);


  //Total Price ve Order Date'e göre sıralama
  const getCellValue = (tr, idx) => tr.children[idx].innerText || tr.children[idx].textContent; //basılan başlık

  const comparer = (idx, asc) => (a, b) => ((v1, v2) => 
  v1 !== '' && v2 !== '' && !isNaN(v1) && !isNaN(v2) ? v1 - v2 : v1.toString().localeCompare(v2)
  )(getCellValue(asc ? a : b, idx), getCellValue(asc ? b : a, idx)); //mevcut durumun asc/desc olmasına göre

  document.querySelectorAll('.sorting').forEach(th => th.addEventListener('click', (() => { //başlıkların click eventine sort function ekleme
    const table = th.closest('table');
    const tbody = table.querySelector('tbody');
Array.from(tbody.querySelectorAll('tr'))
  .sort(comparer(Array.from(th.parentNode.children).indexOf(th), this.asc = !this.asc))
  .forEach(tr => tbody.appendChild(tr) );
  })));   
}
//************************************ */

//Dropdown Filter
function filterTable() {
let dropdown, table, rows, cells, employee, filter; //değişkenler
dropdown = document.getElementById("employeesDropdown");
table = document.getElementById("mytable");
rows = table.getElementsByTagName("tr");
filter = dropdown.value; //dropdown'dan seçilen kişi

  for (let row of rows) { // rows loop
    cells = row.getElementsByTagName("td");
    employee = cells[2]; 
    if (filter === "All" || !employee || (filter === employee.textContent)) {
      row.style.display = ""; // shows this row
    }
    else {
      row.style.display = "none"; // hides this row
    }
  }
}

//İnput Filter 
function inputFilter() { //her 'onkeyup' olduğunda bu function tetikleniyor
var input, filter, table, tr, td, i, txtValue;
input = document.getElementById("myInput");
filter = input.value.toUpperCase();
table = document.getElementById("mytable");
tr = table.getElementsByTagName("tr");

for (i = 0; i < tr.length; i++) { //rows loop
  td = tr[i].getElementsByTagName("td")[1]; //örn. 7. satırın 2. kolonu
  if (td) {
    txtValue = td.textContent;
    if (txtValue.toUpperCase().indexOf(filter) > -1) { //girilen filter değeri bir index'e karşılık geliyorsa göster yoksa gizle
      tr[i].style.display = "";
    } else {
      tr[i].style.display = "none";
    }
  }
}
}

//==================================================================

//===========================DETAIL METHODS=========================

//********Detay Fişi**********
async function FillDetails(orderId){//basılan butonun id bilgisi gönderildi

  var proArr=await productsArr; //Products 'promise'den array'e çekildi

  const dtlDiv=document.querySelector('.product-detail');
  dtlDiv.innerHTML=""; //her butona basıldığında fiş temizlendi

  //const ordArr=await ordersArr; //(yöntem2: async metot içinde old. için Promise.all'a gerek kalmadan )
  Promise.all([ordersArr]).then(values =>{
    values.forEach((element)=>{

      const ord=element.find(x=>x.id==orderId); //orderId'e göre order bulundu
      const dtl=ord.details;
      dtl.forEach((element)=>{ //order'ın details'i dönülerek fiş dolduruldu
        const div=document.createElement('div');
        div.classList.add('dtl-div');

        const p1=document.createElement('p');
        const proName=proArr.find(x=>x.id==element.productId);//ıd'ye göre product
        proName==null ? p1.innerText='Ürün ID:'+element.productId :p1.innerText='Ürün: '+proName.name; //product varsa ismi yoksa id

        const p2=document.createElement('p');
        p2.innerText='Fiyat:'+element.unitPrice;
        const p3=document.createElement('p');
        p3.innerText='Adet:'+element.quantity;
        const p4=document.createElement('p');
        p4.innerText='İndirim: %'+element.discount*100;
        
        div.appendChild(p1);
        div.appendChild(p2);
        div.appendChild(p3);
        div.appendChild(p4);
        dtlDiv.appendChild(div);
      })
    })
  })
}

