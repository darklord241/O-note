### Main flow 
- [Done] Extract each feature's existing logic into its own file/function with no settings checks yet — pure refactor, confirm nothing broke, this alone is a meaningful commit.
- Add settings gating to each module one at a time, testing each toggle actually works (both directions — on and off) before moving to the next.
- Wire buildPanelHTML(settings) last, once you know exactly which DOM chunks each module needs conditionally present.

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
