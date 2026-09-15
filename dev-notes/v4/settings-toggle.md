### main flow 
- options is a separate page which is similar to popup given by manifest V2 onwards 
- this options is just an input taker which takes settings changes and sends it up to the storage.sync (why not .local ? cuz you want sync the settings across the devices for the profile but it wont be of any use since the extension itself is built around a local machine) 
- this storage is the place where settings.js accesses it and is used in the panel.js, why not import directly in panel.js instead of adding an additional file ? (cuz it adds abstraction and modularity so that switching the storage does not affect the working but i could just change it easily in panel.js as well so main reason is for modularity and separation) 
- choosing to leave background.js listener cuz it just sends a message to the place where it is disabled so this message sending pipeline does not affect the performance or usage if left alone 
- some features are interdependent so how do i create a sublist ? (basically for label feature , the element in options.html is a checkbox and only if this checkbox is true and only then i shld show the toggling feature or just make it disabled like faded it out to make it not seem as an accessible option)
- <p> the schema is  ..
``` 
    labelInput: {
        enabled: true/false,
        toggleButton: true/false
    },
    mdRender: {
        enabled: true/false,
        shortcut: true/false,        // Alt+K manual toggle
        autoRenderOnPause: true/false // automatic preview after typing pause
    },
    togglePanelShortcut: true/false,   // standalone, no children — stays a flat boolean
    export: true/false,                 // standalone, no children
    sites: {
        leetcode: true/false,
        codeforces: true/false
    }
```
</p>

### sol 
- `sync` is used and not `local` only cuz it just adds a little bit of helpfulness at negligible cost, so settings is set to the profile cuz even if the extension is not synced across devices, having the settings synced makes sure your preferences stay 
- there is a `data-depends-on` attribute to input element which handles sub options and it is implement properly as well 

### doubts
- think this multiSite should not be a checkbox with sub options but something like multi options choosing so basically not just true or false but adding which options are chosen, i could add multiple boolean checkboxes to all sites but that seems redundant , 
- i thought of adding manual rendering using shortcut and automatic rendering as another sub option to this.
- <p> 
    **Q** : what is data-path and why should i use labelInput.enabled ? why can't it just be labelInput and true means enabled and false means disabled <br>
    **A** : so basically i am forming labelInput as an object having enabled and a suboption as the members so based on enabled member i can decide whether to show the sub option or not. without this, the flat boolean key would not properly handle the relation between the features and sub features 
  </p>


### technical things 
- `<fieldset>` is a native HTML element that visually and semantically groups a set of related form controls — browsers render it with a default border box around its contents.
- `<legend>` is the caption for that box, rendered breaking the top border
- `label:has(input:disabled)` uses the :has() relational pseudo-class to gray out the entire label row (text included, not just the checkbox) when its child input is disabled — this is what makes the "faded, not-currently-accessible" visual
- the manifest.json got one addition `options_ui` which has a interesting field `open_in_tab` to decide whether to open this page on new tab or in extensions itself
- `{ ...DEFAULT_SETTINGS, ...stored.settings }` is an object spread merge: it builds a new object starting with every key from DEFAULT_SETTINGS, then overwrites with every key present in stored.settings.
- found a new event for which you can add a listener - `change`

### options.js
- Every element querySelectorAll returns for a checkbox is an HTMLInputElement — a real DOM object, not something you defined. It comes with a fixed set of built-in properties, and the three you're using are:

    - `.checked` — boolean, reflects whether the checkbox is ticked. Reading it tells you current UI state; setting it (input.checked = true) programmatically ticks/unticks the box. This is how init() syncs the checkbox to match stored settings on page load, and how the change listener later reads what the user just clicked.
    - `.disabled` — boolean, native browser behavior: when true, the browser prevents the user from interacting with it (can't click, can't tab to it, grays it out per your CSS :disabled rule) — this isn't something JS "implements," it's built-in HTML form-control behavior that any `<input>`, `<button>`, `<select>`, etc. has for free.
    - `.dataset` — this is the browser's built-in interface for reading data-* attributes. Any attribute you write as `data-path="labelInput.enabled"` in HTML becomes accessible in JS as input.dataset.path (the browser automatically strips the data- prefix and camelCases multi-word attributes — data-depends-on becomes input.dataset.dependsOn). This is the only link between a given DOM element and your settings object — the string value itself, which your code then manually parses (.split(".")) to know where to look.

- `applyDependencies()` takes care of the dependencies using the `data-depends-on` attribute in the `<input>` element and according disabled the sub options if the parent options is disabled 
- 
