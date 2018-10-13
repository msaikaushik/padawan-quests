//import { Spinner } from "./node_modules/spin.js";

async function dataFetcher(url) {
  fetchedData = [];
  let fetcher = fetch(url);
  let blob = await fetcher;
  let jsonData = await blob.json();
  await fetchedData.push(...jsonData.items);
  await renderItems();
}

function createIssuePost(issueData) {
  let repoName = issueData.repository_url.slice(issueData.repository_url.indexOf('repos/') + 6);
  let bodyContent;
  if(issueData.body.indexOf('```') == 0) {
    bodyContent = issueData.body.slice(4, 80);
  } else {
    bodyContent = issueData.body.slice(0, 80);
  }
  let htmlContent = `<div class='post'>
    <h3 class="issueRepo">${repoName}</h3>
    <h3 class="issueHeading">${issueData.title}</h3><h3 class="langData">${selectedLanguage}</h3>
    <p class="issueBody">${bodyContent}...</p>
  </div>`;
  issuesArea.innerHTML += htmlContent;
}

function renderItems() {
  issuesArea.innerHTML = "";
  if(fetchedData.length == 0) {
    issuesArea.innerHTML = "<h3>Sorry, no issues with the given details. try another one.</h3>"
  }
  for(let issue = 0; issue < fetchedData.length; issue++) {
    createIssuePost(fetchedData[issue]);
  }
}

const baseURL = "https://api.github.com";
let globalLanguage = document.getElementById('language');
let filteredLanguage = document.getElementById('filterLanguage');
let label = document.getElementById('issueLabel');
let searchInputText = document.getElementById('searchField');
let issuesArea = document.getElementById('issuesArea');
let searchButton = document.getElementById('search');
let nextBtn = document.getElementById('next');
let prevBtn = document.getElementById('previous');
let selectedLanguage = globalLanguage.value;
let fetchedData = [];
let pageNumber = 1;
let urlValue;

globalLanguage.addEventListener("change", () => {
  selectedLanguage = globalLanguage.value;
  urlValue = `${baseURL}/search/issues?q= +language:${selectedLanguage}+label=up for grabs+state=open&order=desc`;

  dataFetcher(urlValue);
});

searchButton.addEventListener("click", () => {
  selectedLanguage = filteredLanguage.value;
  let labelValue = label.value;
  let searchValue = searchInputText.value;
  urlValue = `${baseURL}/search/issues?q=${searchValue ? searchValue : ' ' }+language:${selectedLanguage ? selectedLanguage : ' ' }+label=${labelValue}+state=open&order=desc`;

  dataFetcher(urlValue);
});

/* nextBtn.addEventListener("click", () => {
  pageNumber++;
  urlValue += `?page=${pageNumber}`;
  dataFetcher(urlValue);
});

prevBtn.addEventListener("click", () => {
  pageNumber--;
  urlValue += `?page=${pageNumber}`;
  dataFetcher(urlValue);
});
 */