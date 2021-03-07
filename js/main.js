
const countryApi = 'https://restcountries.herokuapp.com/api/v1';
const proxyKey = 'https://api.allorigins.win/raw?url';
const covidApi = 'https://corona-api.com/countries';
const countryInfo = document.querySelector('.country-info');
const totalCases = document.querySelector('.country-info__total-cases').lastElementChild;
const newCases = document.querySelector('.country-info__new-cases').lastElementChild;
const totalDeaths = document.querySelector('.country-info__total-deaths').lastElementChild;
const newDeaths = document.querySelector('.country-info__new-deaths').lastElementChild;
const totalRecovered = document.querySelector('.country-info__total-recovered').lastElementChild;
const criticalCondition = document.querySelector('.country-info__in-critical-condition').lastElementChild;
const graph = document.querySelector('.graph');
const regionsButtons = document.querySelector('.regions').children;
const listOfCountries = document.querySelector('.listOfCountries');
const title = document.querySelector('.title');

const area = {};

async function getCountries() {
    const response = await fetch(`${proxyKey}=${countryApi}`);
    const data = await response.json();
    const countryInRegion = [];

    for(let i = 0; i < data.length; i++){
    if(!['Kosovo'].includes(data[i].name.common))
     countryInRegion.push({name: data[i].name.common, region: data[i].region, key: data[i].cca2});
    }
     
     countryInRegion.forEach(c => {
         if(area[c.region])
         area[c.region].push(c);
         else 
         area[c.region] = [c];
     });  
    

}
console.log(getCountries()); 

const isFetched = {
    Europe: false,
    Africa: false,
    Americas: false,
    Asia: false,
    Oceania: false
};

for(let i = 0; i < regionsButtons.length - 1; i++){
    regionsButtons[i].addEventListener('click', regionButtonHandler);
};
regionsButtons[regionsButtons.length - 1].addEventListener('click', allCountriesHandler);

async function regionButtonHandler() {
    const regionName = this.textContent;
    title.textContent = regionName;
    displayElement(title);
    removeElement(countryInfo);

   
    if(isFetched[regionName] === false) {
        await fetchRegionInfo(regionName);
    }

    fillGraph(regionName);
    drawGraph();
    createCountriesSection(regionName);
};

async function fetchRegionInfo(region) {
    isFetched[region] = true;

    const newRegion = [];
    for(let i = 0; i < area[region].length; i++){
        const url = `${covidApi}/${area[region][i].code}`;
        const response = await fetch(url);
        const json = await response.json();
        const data = json.data;


        newRegion.push({
            ...area[region][i],
            totalCases: data.latest_data.confirmed,
            newCases: data.today.confirmed,
            totalDeaths: data.latest_data.deaths,
            newDeaths: data.today.deaths,
            totalRecovered: data.latest_data.recovered,
            criticalCondition: data.latest_data.critical
        });
    };

    area[region] = newRegion;
};

function createCountriesSection (region) {
    listOfCountries.innerHTML = "";
    
    area[region].forEach(country => {
        const button = document.createElement('button');
        button.textContent = country.name;
        listOfCountries.appendChild(button);
        button.addEventListener('click', countryButtonHandler.bind(country));
    });
};


function countryButtonHandler() {
    title.textContent = this.name;
    totalCases.textContent = this.totalCases;
    newCases.textContent = this.newCases;
    totalDeaths.textContent = this.deaths;
    newDeaths.textContent = this.newDeaths;
    totalRecovered.textContent = this.totalRecovered;
    criticalCondition.textContent = this.criticalCondition;

    removeElement(graph);
    displayElement(countryInfo);
};

async function allCountriesHandler() {
    const regionsNames = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
    for (let i = 0; i < regionsNames.length; i++){
        if(!isFetched[regionsNames[i]])
            await fetchRegionInfo(regionsNames[i]);
            area.all = area.all.concat(area[regionsNames[i]]);
    };
    
    title.textContent = 'All Countries';

    displayElement(title);
    removeElement(countryInfo);
    fillGraph('all');
    drawGraph();
    createCountriesSection('all');
};


let labels = [];
let datasets = [];
function drawGraph(){
    const ctx = document.getElementById('canvas').getContext('2d');
    const myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets,
        },
        options: {
            responsive: true,
            title: {
                display: true,
            },
        }
    });
    displayElement(graph);
};

function fillGraph(region) {
    labels = [];
    datasets = [];
    datasets = [
        newDataset('Confirmed Cases', 'red'),
        newDataset('Number Of Deaths', 'black'),
        newDataset('Number Of Recovered', 'green'),
        newDataset('Number Of Critical Condition', 'purple'),
    ];

    const countries = area[region];

    countries.forEach(country => {
        labels.push(country.name);
        datasets[0].data.push(country.totalCases);
        datasets[1].data.push(country.totalDeaths);
        datasets[2].data.push(country.totalRecovered);
        datasets[3].data.push(country.criticalCondition);
    });
};
function newDataset(label, color){
    return {
        label: label,
        data:[],
        backgroundColor: color,
        borderColor: color,
        pointRadius: 4,
        pointHoverRadius: 15,
        type: 'bar',
        hidden: false,
        fill: false,
    }
}

function removeElement(element) {
    element.classList.add('hide')
};

function displayElement(element) {
    element.classList.remove('hide');
};



