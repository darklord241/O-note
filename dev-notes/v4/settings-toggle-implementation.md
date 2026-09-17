### Main flow 
- [Done] Extract each feature's existing logic into its own file/function with no settings checks yet — pure refactor, confirm nothing broke, this alone is a meaningful commit.
- Add settings gating to each module one at a time, testing each toggle actually works (both directions — on and off) before moving to the next.
- Wire buildPanelHTML(settings) last, once you know exactly which DOM chunks each module needs conditionally present.
- a sites toggle change won't take effect until the content script itself reloads — which happens on a genuine page reload, not on LeetCode's SPA in-page navigation between problems (that's exactly the scenario isProcessing/onHistoryStateUpdated exist to handle without a real page load). So if you flip a site off in options and just click to another problem, you won't see it take effect until you hit browser-refresh.

### npm run dev 
- this was set up before only and it is used to test things out as the code changes 
- i dont have to build it everytime and move it to windows and unpack it 
- as long as this dev session is going on, all the changes saved are updated immediately on the place where you have unloaded it 
- **error** : panel.css is being sent twice into the browser and it was in `content_scripts` and `web_accessible_resources` so i removed it from the former 

### buildHtmlPanel 
- i separated this out and it is working fine and i have to pass `questionId` here cuz i have to convert into title using `slugToTitle` 

### markdownPreview 
- this modularized all the md support and the two modes toggling as well 
- it is called after `panelElements` cuz there is an if condition at the end of this function which calls the `showPreviewMode` function and this has a if check for `panelElements` in the beginning so if it is called before panelElements is even defined then it will just return always without doing any operation
- i have yet to add the settings still

### labelFeature
- this modularized all the label features and the input toggling as well and yet to add the dependencies on the settings 
- now i faced a problem here cuz it called `doSave` function which is in `renderPanel` so i decided to just put it in the argument list and call it 
- the more severe issue is the `doSave` also sends `currentlabels` as one of its data and since this variable is declared in this func but `doSave` in `renderPanel` couldnt access this so the label member was accessed from the object returned by this function 
- so the changes for above was to return an object which contained currentLabels 

### togglePanelShortcut
- first i checked how this flow works and thought of putting it in the function `togglePanel` in panel.js but this makes the collapse button useless 
- so i decided to add the settings check in the content.js before the event listener function calls togglePanel
- `settings?.togglePanelShortcut` : ? is here in case this togglePanel shortcut message is sent even before settings is initialised and in that case the if condition fails and no-op takes place

### Export 
- **Initial thought** : i can either add this check in popup.js or put it in the exportAllNotes function in export.js itself, this i have to anyway come out of panel.js to do it so i dont know which one to do but i think its better to not even show this button or fade it out if the toggle is switched and for this i have to work on popup.html css as well as js i think i will do this at the end
- UI-level (fade/disable the button in popup.html/popup.js, same disabled + CSS pattern as your options page sub-options) is what actually matters for user experience — that's the one to prioritize and matches your instinct
- and i can add a check within the function itself just as a safeguard : yeah not needed cuz only one place is calling it and i have put a check there 
- same as sites, i made a `init()` func which get settings and calls the loadNoteCount() func and then the export settings is checked and if it is true then the event listener is added and if not then the btn is disabled and i already had disabled css so it works out 

### sites
- this faces no problem cuz the `getActiveAdapter` function deals with this in content.js and i can add this check before returning it 
- in content.js, i made a `init()` func which initialises the settings and it is an async func cuz `getSettings()` is async and hence `await` keyword is also used and the previous `handleQuestionChange()` was also added to this 
