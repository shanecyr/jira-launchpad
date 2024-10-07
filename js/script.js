const defaultHost = 'stanford.atlassian.net';
const defaultProject = 'DS';
const alternateHost = 'stanfordits.atlassian.net';
const alternateProject = 'ADAPT';
const currHost = window.location.hostname;
const jbModal = document.getElementById('jiraBookmarkletModal');
const jbToggle = document.getElementById('jiraBookmarkletInstanceToggle');
const jbInputCont = document.getElementById('jiraBookmarkletInputContainer');
const jbInput = document.getElementById('jiraBookmarkletInput');
const jbGo = document.getElementById('jiraBookmarkletGoButton');
const failoverPath = '/jira/software/projects/DS/boards/6914';
//const jbCancel = document.getElementById('jiraBookmarkletCancelButton');
var searchHost;
var searchProject;
var searchInput;
if (currHost == alternateHost) {
    jbToggle.checked = true;
    jbInputCont.classList.add('alternateHost');
    jbGo.classList.add('alternateHost');
    searchHost = alternateHost;
    searchProject = alternateProject;
} else {
    jbToggle.checked = false;
    jbInputCont.classList.remove('alternateHost');
    jbGo.classList.remove('alternateHost');
    searchHost = defaultHost;
    searchProject = defaultProject;
}
jbToggle.addEventListener('click', function() {
    if (jbToggle.checked == true) {
        jbInputCont.classList.add('alternateHost');
        jbGo.classList.add('alternateHost');
        searchHost = alternateHost;
        searchProject = alternateProject;
    } else {
        jbInputCont.classList.remove('alternateHost');
        jbGo.classList.remove('alternateHost');
        searchHost = defaultHost;
        searchProject = defaultProject;
    }
    getSearchType();
});
function getSearchType() {
    const isJiraKey = /^[A-z]+-\d+$/;
    const isSubKey = /^\d+$/;
    const isForcedJQL = /^\?.*/;
    const isProbableJQL = /[=(~]/;
    var searchType = 'key';
    if (searchInput == '') {
        searchType = 'failover';
    } else {
        if (isJiraKey.test(searchInput)) {
            searchType = 'key';
        } else {
            if (isSubKey.test(searchInput)) {
                searchType = 'subkey';
            } else {
                if (isForcedJQL.test(searchInput)) {
                searchType = 'jql';
                } else {
                    if (isProbableJQL.test(searchInput)) {
                        searchType = 'jql';
                    } else {
                        searchType = 'text';
                    }
                }
            }
        }
    }
    if (searchType == 'subkey') {
        document.getElementById('jiraBookmarkletInputTypeDisplay').innerText = searchProject.toUpperCase();
    } else {
        document.getElementById('jiraBookmarkletInputTypeDisplay').innerText = searchType;
    }
    return searchType;
}
jbGo.addEventListener('click', function() {
    var jiraSearchType = getSearchType();
    var url;
    switch(jiraSearchType) {
        case 'key':
            url = 'https://'+searchHost+'/browse/'+searchInput.toUpperCase();
            break;
        case 'subkey':
            url = 'https://'+searchHost+'/browse/'+searchProject.toUpperCase()+'-'+searchInput;
            break;
        case 'text':
            url = 'https://'+searchHost+'/issues/?jql=text~"'+searchInput+'"';
            break;
        case 'jql':
            searchInput = searchInput.replace(/\?\s+/,'');
            url = 'https://'+searchHost+'/issues/?jql='+searchInput;
            break;
        case 'failover':
            url = 'https://'+searchHost+failoverPath;
            break;
    }
    window.location.replace(url);
});
//jbCancel.addEventListener('click', function() {
//    window.close();
//});
jbInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        jbGo.click();
    //} else if (event.key === 'Escape') {
    //    event.preventDefault();
    //    jbCancel.click();
    } else if (event.key === 'Tab') {
        event.preventDefault();
        jbToggle.click();
    }
});
jbInput.addEventListener('keyup', function(event) {
    searchInput = document.getElementById('jiraBookmarkletInput').value.trim();
    getSearchType();
});
document.addEventListener("DOMContentLoaded", function(event) { 
  document.getElementById('jiraBookmarkletInput').focus();
});
