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