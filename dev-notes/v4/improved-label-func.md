### main abstract improvements 
- changed the UI from a textarea to tags which are taken from an input element 
- change in db schema to remove the label updatedAt field 
- replacement of individual label variable to an array of strings which holds multiple labels which are tagged (helps when i add filter feature)

### how it is used and its implementation 
- Usage : if you type anything in the input and then use either `Enter` key or type `,` then the text in the input is taken as a label and displayed <br>
Implementation : an event listener for either input which calls the `renderChip()` to change the display of the tags and `doSave()` to save the new label into db <br>

- UI working : the `renderChip()` func uses the labels and creates a separate span element and removeBtn + listener for each label and appends it to the div chipContainer 

### Db versioning and migration process
- Dexie is just a wrapper over the IndexedDB API and this DB is schemaless so dexie's `.store()` gives a declared set of **indexes** + **version number**
- the `.upgrade()` runs on every stored row cuz the version of the code run is higher than the stored db version 
- this upgrade function modifies the label into array of labels and removes the old label field 
- if this upgrade had failed due to some error(many possible options) the DB api would have rolled back the entire transaction and the data would remain the same as the older version 

### HTML changes
- textarea -> input 
- display of tags/labels done using span child element addition to the parent div element 
- removal of all old label elements and constants 
- **CSS complelely offloaded to claude**

### Code doubts 
1. `let currentLabels = [<br>.(note?.labels ?? [])];` <br>
note?.labels is optional chaining to prevent checking label if note is undefined <br>
... ?? [] is called nullish coalescing where if the left side comes up as null or undefined then an empty array is used instead <br>
**(new thing)** [...(...)] creates a new array literal containing the same elements but kept as an independent copy <br> 

2. Event listeners run indefinitely even if the function in which it exists is called only once , How ? (noticed it only now) <br> 
    A standard event listener stays active until one of three things happens: <br>
    - You explicitly remove it using removeEventListener()
    - The target element is destroyed or removed from the DOM (and cleaned up by the browser's garbage collector)
    - The page is reloaded or closed, which resets the entire execution environment

    If you call a wrapper function only once, that function executes, registers the event listener to the element, and terminates. However, the event listener remains "alive" in the browser's background memory. Every time a user clicks (or triggers the event), the inner callback function will fire again and again
