const url='http://localhost:3000';

async function GetSuppliers(){
   const response=await fetch(url+"/suppliers");
   const suppliers=await response.json();
}
const btnSupp=document.querySelector("#getSuppliers");
btnSupp.addEventListener("click",()=>{
    GetSuppliers();
})

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
}
const btnOrd=document.querySelector("#getOrders");
btnOrd.addEventListener("click",()=>{
    GetEmployees();
    GetOrders();
})

function CreateTable(array,empArr){
    const divElement=document.querySelector(".table");
    const tableElement=document.createElement("table");
    tableElement.setAttribute("border","1");
    const theadElement = document.createElement("thead");
    const tbodyElement = document.createElement("tbody");

    const tr=document.createElement("tr");
    const th1=document.createElement("th");
    th1.innerText="Id";
    const th2=document.createElement("th");
    th2.innerText="MusteriId";
    const th3=document.createElement("th");
    th3.innerText="Calisan";
    const th4=document.createElement("th");
    th4.innerText="Siparis Tarihi";
    const th5=document.createElement("th");
    th5.innerText="Siparis Tutarı";
    tr.appendChild(th1);
    tr.appendChild(th2);
    tr.appendChild(th3);
    tr.appendChild(th4);
    tr.appendChild(th5);
    theadElement.appendChild(tr);


    for (let i = 0; i < array.length; i++) {
        const order = array[i];
        const tr1=document.createElement("tr");

        const td1=document.createElement("td");
        td1.innerText=order.id;
        const td2=document.createElement("td");
        td2.innerText=order.customerId;
        


        const td3=document.createElement("td");
        //2 yöntem
        //1: map ile tüm order listesini ve employee  listesini verip, order listesinden empID yerine empName'ler yazılı şekilde çekmek
        //2: employeeList içerisinde empID'e göre filter yapıp empName'ine ulaşılır
        const emp=empArr.find(x=>x.employeeId==order.employeeId);
        td3.innerText=emp.firstName+' '+emp.lastName; 



        const td4=document.createElement("td");
        td4.innerText=order.orderDate; //shortDate'e çevrilecek

        let detail=order.details;
        let totalPrice=0;
        detail.forEach(dtl => {
            totalPrice+=(dtl.unitPrice*dtl.quantity*(1-dtl.discount));
        });
        const td5=document.createElement("td");
        //td5.innerText=Math.round(totalPrice*100)/100;
        td5.innerText=totalPrice.toFixed(2);

        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tr1.appendChild(td3);
        tr1.appendChild(td4);
        tr1.appendChild(td5);

        tbodyElement.appendChild(tr1);
    }

    tableElement.appendChild(theadElement);
    tableElement.appendChild(tbodyElement);

    divElement.appendChild(tableElement);
}

const btnSort=document.querySelector("#btnSort");
btnSort.addEventListener("click",()=>{
    sortTable();
})
function sortTable() {
  var table, rows, switching, i, x, y, shouldSwitch;
  table = document.getElementById("mytable");
  switching = true;
  /*Make a loop that will continue until
  no switching has been done:*/
  while (switching) {
    //start by saying: no switching is done:
    switching = false;
    rows = table.rows;
    //console.log(table);
    //console.log(rows);
    /*Loop through all table rows (except the
    first, which contains table headers):*/
    for (i = 1; i < (800 - 1); i++) {
      //start by saying there should be no switching:
      shouldSwitch = false;
      /*Get the two elements you want to compare,
      one from current row and one from the next:*/
      x = rows[i].getElementsByTagName("TD")[0];
      y = rows[i + 1].getElementsByTagName("TD")[0];
      //check if the two rows should switch place:
      if (Number(x.innerHTML) > Number(y.innerHTML)) {
        //if so, mark as a switch and break the loop:
        shouldSwitch = true;
        break;
      }
    }
    if (shouldSwitch) {
      /*If a switch has been marked, make the switch
      and mark that a switch has been done:*/
      rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
      switching = true;
    }
  }
}