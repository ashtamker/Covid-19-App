const countryApi = 'https://restcountries.herokuapp.com/api/v1';
const proxykey = 'https://api.allorigins.win/raw?url'; 
const covidApi = 'https://corona-api.com/countries';
const regionsButtons = document.querySelector('.regions').children;
const theCountriesList = document.querySelector('.theCountriesList');
const title = document.querySelector('.title');
const countryInfo = document.querySelector('.country-info');
const totalCases = document.querySelector('.country-info-totalCases').lastElementChild;
const newCases = document.querySelector('.country-info-newCases').lastElementChild;
const totalDeaths = document.querySelector('.country-info-totalDeaths').lastElementChild;
const newDeaths = document.querySelector('.country-info-newDeaths').lastElementChild;
const totalRecovered = document.querySelector('.country-info-totalRecovered').lastElementChild;
const criticalCondition = document.querySelector('.country-info-CriticalCondition').lastElementChild;
const graph = document.querySelector('.graph');


const area = {};

async function getCountries() {
    const response = await fetch(`${proxykey}=${countryApi}`);
    const data = await response.json();
    const countryInRegion = [];

    for(let i = 0; i < data.length; i++){
        if(!['Kosovo'].includes(data[i].name.common))
        countryInRegion.push({name: data[i].name.common, region: data[i].region, code: data[i].cca2 })
    }

    
    countryInRegion.forEach(country => {
        if(area[country.region])
            area[country.region].push(country);
        else 
        area[country.region] = [country];
    });   

    area.all = [];
}

getCountries();

const isFetched = {
    Europe: false,
    Africa: false,
    Americas: false,
    Asia: false,
    Oceania: false
};

for(let i = 0; i < regionsButtons.length - 1; i++){
    regionsButtons[i].addEventListener('click', regionButton);
};
regionsButtons[regionsButtons.length - 1].addEventListener('click', allCountriesHandler);

async function regionButton() {
    const regionName = this.textContent;
    title.textContent = regionName;
    displayItem(title);
    removeItem(countryInfo);

    if(isFetched[regionName] === false) {
        await getRegionInfo(regionName);
    }

    fillGraph(regionName);
    drawGraph();
    createTheCountries(regionName);
};

async function getRegionInfo(region) {
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

function createTheCountries (region) {
    theCountriesList.innerHTML = "";
    
    area[region].forEach(country => {
        const button = document.createElement('button');
        button.textContent = country.name;
        theCountriesList.appendChild(button);
        button.addEventListener('click', countryHandler.bind(country));
    });
};


function countryHandler() {
    title.textContent = this.name;
    totalCases.textContent = this.totalCases;
    newCases.textContent = this.newCases;
    totalDeaths.textContent = this.deaths;
    newDeaths.textContent = this.newDeaths;
    totalRecovered.textContent = this.totalRecovered;
    criticalCondition.textContent = this.criticalCondition;

    removeItem(graph);
    displayItem(countryInfo);
};

async function allCountriesHandler() {
    const regionsNames = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
    for (let i = 0; i < regionsNames.length; i++){
        if(!isFetched[regionsNames[i]])
            await getRegionInfo(regionsNames[i]);
        area.all = area.all.concat(area[regionsNames[i]]);
    };
    
    title.textContent = 'All Countries';

    displayItem(title);
    removeItem(countryInfo);
    fillGraph('all');
    drawGraph();
    createTheCountries('all');
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
    displayItem(graph);
};

function fillGraph(region) {
    labels = [];
    datasets = [];
    datasets = [
        newDataset('Confirmed', 'red'),
        newDataset('Deaths', 'black'),
        newDataset('Recovered', 'green'),
        newDataset('Critical Condition', 'purple'),
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
        type: 'bar',
        hidden: false,
        fill: false,
    }
}

function removeItem(item) {
    item.classList.add('hide')
};

function displayItem(item) {
    item.classList.remove('hide');
};

