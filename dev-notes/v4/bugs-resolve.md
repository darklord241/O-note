### Bugs found 
1. the panel seems to increase its width based on the labels i add and it is going out of the browser due to this 
     if i add lengthy labels then it is increasing the width and even in its default position before label would fit but after label addition
     panel extends to the right 
2. case sensitive labels, basically hard and Hard are considered different and can just be taken care of a little 

### fixes 
1. change the css for the label-chip class element due to the way flexbox works where this class element does only know tht it can extend due to which the whole panel also increases its width 
2. move from `.includes(value)` to `.some(l => l.toLowerCase() === value.toLowerCase())` : both include and some search the array but include does search for the exact value where some allows the modification to lower case before checking 
