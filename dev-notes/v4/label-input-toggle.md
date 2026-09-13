### main part 
- pretty much similar to the panel collapse working
- since i have not created a shortcut for this, the function `updateLabelInputVisibility` stays within `renderPanel` func 
- also used the focus func to move the cursor to label input once it is toggled open and i dont have to use setSelectionRange since this input element is always empty 
- the decision to make this toggle button within the label row is cuz if it is in the input row then how will it toggled open if the button itself is not visible 