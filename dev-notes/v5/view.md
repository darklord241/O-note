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
- i thought i had saved the actual notes in db as `content` and not `note` but somewhere it got changed (have to check) **read the next commit 3rd point**
- there is a js niche case in `note.labels.some(label => label.toLowerCase().includes(searchInput.toLowerCase()));` where if i use `{}` with arrow func then a return is required but without it, works normally itself 

### commit 3 
- i removed the alphabetical sorting cuz its not required man 
- i added sorting here and used the concept of `Comparators` which i had learnt in Java for heaps in DSA damn 
- so i faced a notes generation change due to the md to json i got from chatgpt which had note instead of content so when i added a new note it had content only and hence i had to import the notes after changing all note to content and also change it within the scripts 
- next error i found is the labels were not being added into the dropdown so i had missed that part, got it done 

### things left to do 
- Open Question button → actually navigate to the LeetCode/Codeforces problem
- Empty-state message when no notes match
- Search-match highlighting
- Maybe improve the card layout / multiple cards per row
- A bit of UI cleanup/responsiveness
- Possibly preserve the selected filters while interacting with the page

### commit 4 highlighting stuff 
- this was purely UI stuff and so what i did here is `filteredNotes` has only those which match the search input and hence in `createNoteCard()` the searchInput === "" check shows that the filter is applied or not 
- if the search filtered is applied then i have to call the highlightMatch part which replaces the match stuff after covering it in a span element which highlights it  