const months = ['','January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const colors = ['#ea4335', '#34a853', '#4285f4', '#fbbc05']
const title = ['T', 'o', 'd', 'a', 'y', ' ', 'i', 'n', ' ', 'G', 'o', 'o', 'g', 'l', 'e', ' ', 'd', 'o', 'o', 'd', 'l', 'e', 's', ' ', 'h', 'i', 's', 't', 'o', 'r', 'y']

let newDate;
let current = new Date();


let defaultDate = document.querySelector('.currentDate')
defaultDate.addEventListener('mouseover', editDate)
document.querySelector('body').addEventListener('click', restoreDate)
// document.querySelector('body').addEventListener('mouseout', restoreDate)

// move a date back
document.querySelector('#moveBack').addEventListener('click', moveBack)

// move a date foward
document.querySelector('#moveForward').addEventListener('click', moveForward)

// change colors on hover
// document.querySelectorAll('.btn-primary').addEventListener('mouseover', changeColors)

createTitle()
displayDate(current)
iterateOlderYears()

document.querySelector('#getDoodles').addEventListener('click', changeDate)

async function iterateOlderYears(){
    let row = document.createElement('div')
    row.classList.add('row')
    document.querySelector('.container').append(row)

    let today = getTodaysDate(current)
    console.log(today);
    let currentYear = Number(today.year)
    let currentMonth = today.month
    let currentDay = today.day
    console.log(typeof currentYear);
    // while(currentYear != 1998){
        for (let year=currentYear; year >= 1998; year--){
            console.log(year);
            let url = await fetch(`https://google-doodles.herokuapp.com/doodles/${year}/${currentMonth}?hl=en`)
            let res = await url.json()
            
            let desiredDoodles = filterByDay(res, currentDay)
            desiredDoodles.forEach(element => {
                    console.log(element)
                    createCard(element)
            })
//         fetch(`https://google-doodles.herokuapp.com/doodles/${year}/${currentMonth}?hl=en`)
// .then(res => res.json())
// .then(data => {
//     let desiredDoodles = filterByDay(data, currentDay)
//     desiredDoodles.forEach(element => {
//         console.log(element)
//         createCard(element)
//     });
// })
    }
}

function createTitle(){
    let h1 = document.querySelector('h1')
    for(let i = 0; i < title.length; i++){
        let span = document.createElement('span')
        span.innerText = title[i]
        span.style.color = generateRandomColors()
        h1.append(span)
    }
}

// Display date
function displayDate(dateParam){
    console.log(dateParam);
    let date = getTodaysDate(dateParam)
    let dateString = `${months[date.month]} ${date.day}, ${date.year}`
    let dateStringFormated = `${date.month}/${date.day}/${date.year}`
    document.querySelector('h4').innerText = dateString
    document.querySelector('#newDateInput').value = dateStringFormated
}

function editDate(){
    document.querySelector('.defaultDate').classList.add('hide')
    document.querySelector('#changeDate').classList.remove('hide')
}

function restoreDate(){
    document.querySelector('.defaultDate').classList.remove('hide')
    document.querySelector('#changeDate').classList.add('hide')
}

function changeDate(){
    newDate = document.querySelector('#newDateInput').value

    if(validateDate(newDate)){
        document.querySelector('#errorMessage').classList.add('hide')
        newDate = newDate.split('/')
        reloadPage()
    } else {
        document.querySelector('#errorMessage').classList.remove('hide')
        console.log("Invalid Date");
    }
}

function moveBack(){
    let changedDate = document.querySelector('#newDateInput').value
    changedDate = changedDate.split('/')

    let newChangedDate = new Date(changedDate)
    newChangedDate = new Date(newChangedDate.setDate(newChangedDate.getDate() - 1))

    newDate = [newChangedDate.getMonth() + 1, newChangedDate.getDate(), newChangedDate.getFullYear()]
    reloadPage()
}

function moveForward(){
    let changedDate = document.querySelector('#newDateInput').value
    changedDate = changedDate.split('/')

    let newChangedDate = new Date(changedDate)
    newChangedDate = new Date(newChangedDate.setDate(newChangedDate.getDate() + 1))

    newDate = [newChangedDate.getMonth() + 1, newChangedDate.getDate(), newChangedDate.getFullYear()]
    reloadPage()
}

function reloadPage(){
    document.querySelector('.row').remove();
    displayDate(newDate)
    iterateOlderYears()
}

function createCard(data){   
    // Create arrangement
let col = document.createElement('div')
col.classList.add('class','col-xs-12')
col.classList.add('class','col-md-4')

// Create card
let card = document.createElement('div')
card.setAttribute('class', 'card')

// Create image
var image = document.createElement('img')
image.classList.add('card-img-top')
// image.src = data.alternate_url
let url = data.high_res_url.split('//')
image.src = 'https://' + url[1]

// Create Card body
let cardBody = document.createElement('div')
cardBody.classList.add('card-body')

// Create Card title
let cardTtile = document.createElement('h5')
cardTtile.classList.add('card-title')
cardTtile.innerText = data.query

// Create Card text
let cardText = document.createElement('p')
cardText.classList.add('card-text')
// cardText.innerText = data[0].run_date_array[0]
// let date = getTodaysDate()
let date = data.run_date_array
cardText.innerText = months[date[1]] + ' ' + date[2] + ', ' + date[0]

// Create anchor tag
let cardLink = document.createElement('a')
cardLink.classList.add('btn')
cardLink.classList.add('btn-primary')
cardLink.style.backgroundColor = generateRandomColors()
cardLink.innerText = 'What in the doodle?'
cardLink.href = data.alternate_url

let row = document.querySelector('.row')
row.append(col)
col.append(card)
card.append(image)
card.append(cardBody)

cardBody.append(cardTtile)
cardBody.append(cardText)
cardBody.append(cardLink)

let changeColor = document.getElementsByClassName('btn-primary');

// Change color
Array.from(changeColor).forEach(function(element) {
    element.addEventListener('mouseover', function(){
        element.style.backgroundColor = generateRandomColors()
    })
})
}

function getTodaysDate(currentDate){
    let dateObj;
    if(newDate == undefined){
        console.log("inactive ", newDate);
        // let date = new Date()
        dateObj = {
            day : currentDate.getDate(),
            month : currentDate.getMonth() + 1,
            year: currentDate.getFullYear()
        }
    } else {
        console.log("activated ", newDate);
        dateObj = {
            day : newDate[1],
            month : newDate[0],
            year: newDate[2]
        }
    }
    return dateObj;
}

function filterByDay(data,day){
    return data.filter(d => d.run_date_array[2] == day)
}

function generateRandomColors(){
    let randomIndex = Math.floor(Math.random() * colors.length)
    return colors[randomIndex]
}

function validateDate(date){
    let hasNoLetters = date.split('/').every(num => num > 0)

    if(!hasNoLetters){
        return false;
    }

    return Date.parse(date) > 0 ? true : false;
}