const form = document.querySelector("form");
const url = `https://crudcrud.com/api/d4836dbaead44c91b719a48b8baa5077`;
var count = 0;
window.addEventListener("DOMContentLoaded", () => {
  axios
    .get(`${url}/itemList`)
    .then((res) => {
      for (let i = 0; i < res.data.length; i++) {
        displayOnScreen(res.data[i]);
      }
    })
    .catch((err) => {
      console.log(err);
    });
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const itemName = document.querySelector("#itemName");

  const price = document.querySelector("#price");
  const quantity = document.querySelector("#qty");

  const items = {
    iname: itemName.value,

    iprice: price.value,
    iqty: quantity.value,
  };
  addToCrud(items);
  itemName.value = "";

  price.value = "";
  quantity.value = "";
});

function addToCrud(items) {
  axios
    .post(`${url}/itemList`, items)
    .then((res) => {
      displayOnScreen(res.data);
    })
    .catch((err) => {
      console.log(err);
    });
}

function displayOnScreen(items) {
  count += 1;

  const ul = document.querySelector("ul");
  const total = document.querySelector("#total");
  total.textContent = `Total :${count}`;
  const li = document.createElement("li");
  const sellQty = document.createElement("input");
  sellQty.type = "number";
  sellQty.id = "sellQty";

  const buy = document.createElement("button");
  buy.appendChild(document.createTextNode("Buy"));

  const del = document.createElement("button");
  del.appendChild(document.createTextNode("X"));
  del.className = "del";

  li.appendChild(
    document.createTextNode(
      `${items.iname}-----Rs${items.iprice}-----${items.iqty}KG`
    )
  );
  li.appendChild(sellQty);

  li.appendChild(buy);

  li.appendChild(del);
  ul.insertBefore(li, total);

  //eventlisteners

  del.addEventListener("click", (event) => {
    count -= 1;
    total.textContent = `Total:${count}`;
    const id = items._id;
    axios
      .delete(`${url}/itemList/${id}`)
      .then((res) => {
        console.log(res);
        event.target.parentElement.remove();
      })

      .catch((err) => {
        console.log(err);
      });
  });

  buy.addEventListener("click", (event) => {
    const msgAlert = document.querySelector("#alert");
    const sellNo = sellQty.value;
    if (items.iqty >= sellNo) {
      console.log(items);
      items.iqty -= sellNo;

      const id = items._id;
      const itemsSend = { ...items };
      delete itemsSend._id;
      console.log(itemsSend);
      axios
        .put(`${url}/itemList/${id}`, itemsSend)
        .then((res) => {
          console.log(res.data);
          event.target.parentElement.firstChild.nodeValue = `${items.iname}-----Rs${items.iprice}-----${items.iqty}KG`;
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      msgAlert.innerHTML += "not enough";
      setTimeout(() => {
        msgAlert.innerHTML = "";
      }, 2000);
      //   console.log("Not enough quantity");
    }
  });
}
