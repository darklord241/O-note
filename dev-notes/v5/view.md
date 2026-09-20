### decisions
- make a separate view page instead of using options or popup 
- build it phase wise 
    1. view all 
    2. render each note card properly
    3. filtering : sites -> labels
    4. search across : note, questionId, label
    5. sorting 
    6. add ques url with note card
- view all is done using the `getAllNotes()` func so pretty easy but setting up the html page is smtg i dont like 
- note card again is smtg that i will apply on the cachedNotes 

### progress 
- yeah i copied the html and css from gpt 

- <main>	Semantic HTML element	Contains the primary page content
- <section>	Semantic HTML element	Groups related content
- .note-meta	CSS class we created	Styles the bottom info/action row
- .empty-state	CSS class we created	Styles "no results" message
- @media	CSS feature	Makes layout adapt to small screens

- yeah it came out pretty nicely, i mean the design from claude so thats good 

### commit 2 
- filtering on the basis of site : yeah made a separate func but realised i would hv to call this func and improvised it by assuming i could remove `renderNotes()` add this filter note but then when all filters come up it gets cumbersome and messy 
- so make a single filter func and call it whenever the event triggers and these listeners stay in `renderPage()` 
- now the filtering on lables is AND which means all the labels should be there but my filtering UI currently takes only one label at a time cuz it is a select element 
- this search input is real time filtering which means the notes update on each and every change of char in the searchbar 
- the search is done on labels, questionId as well as the content of the note
- i thought i had saved the actual notes in db as `content` and not `note` but somewhere it got changed (have to check)
- there is a js niche case in `note.labels.some(label => label.toLowerCase().includes(searchInput.toLowerCase()));` where if i use `{}` with arrow func then a return is required but without it, works normally itself 
- 