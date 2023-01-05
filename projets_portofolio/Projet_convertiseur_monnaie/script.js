const dropList = document.querySelectorAll(".drop-list select"),
fromCurrency = document.querySelector(".form select"),
toCurrency = document.querySelector(".to select"),
getButton = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
    for (currency_code in country_list){
        let selected;
        if(i===0){
            selected = currency_code === "USD" ? "selected" : ""
        }else if (i === 1){
            selected = currency_code === "EUR" ? "selected" : ""
        }
        //console.log(currency_code)
        let optionTag = '<option value="' + currency_code +' "'+ selected +'>'+currency_code+'</option>'
        dropList[i].insertAdjacentHTML("beforeend", optionTag)
    }
    dropList[i].addEventListener("change",
        e => {
            loadFlag(e.target)
        })
}
function loadFlag(element){
    for (code in country_list){
        let imgTag = element.parentElement.querySelector("img")
        if (element.value !== "USD" || element.value !== "EUR"){
            imgTag.src = "https://countryflagsapi.com/png/"+country_list[element.value.split(" ").join("")]
        }else { imgTag.src = "https://countryflagsapi.com/png/"+element.value}

    }
}

getButton.addEventListener("click", e =>{
    e.preventDefault()
    getExchangeRate()
})
window.addEventListener("load", () =>{
    getExchangeRate()
    loadFlag( fromCurrency)
    loadFlag(toCurrency)
})

const exchangeIcon = document.querySelector(".drop-list .icon")
exchangeIcon.addEventListener("click",()=>{
    let tempCode = fromCurrency.value
    fromCurrency.value = toCurrency.value
    toCurrency.value = tempCode
    loadFlag( fromCurrency)
    loadFlag(toCurrency)
    getExchangeRate()
})
function getExchangeRate() {
    const amount = document.querySelector(".amount input")
    exchangeRateTxt = document.querySelector(".exchange-rate")
    let amountVal = amount.value
    if (amountVal === "" || amountVal === "0"){
        amount.value = "1"
        amountVal = 1
    }
    exchangeRateTxt.innerText = "Obtention du taux de change ..."
    let url = "https://v6.exchangerate-api.com/v6/4b7e2e82e7811598f60a439c/latest/"+ fromCurrency.value
    //fetch(url).then(response => console.log(response.json()))
    fetch(url).then(response => response.json()).then(result => {
        let exchangeRate = result.conversion_rates[toCurrency.value.split(" ").join("")]
        let totalExchangeRate = (amountVal * exchangeRate).toFixed(2)
        //console.log(totalExchangeRate)
        const exchangeRateTxt = document.querySelector(".exchange-rate")
        exchangeRateTxt.innerText = amountVal+" " + fromCurrency.value +"="+ totalExchangeRate+" " + toCurrency.value
    }).catch(()=>{
        exchangeRateTxt.innerText ="Une erreur c'est produite."
    })
}