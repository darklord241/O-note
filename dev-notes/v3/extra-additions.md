### Cursor movement 
- the change done in panel.js is in togglePanel where the cursor is moved to the panel when a new note is opened either using collapse button or shortcut key 
- the functionality of it is mentioned using comments in the code as well 
- this is mainly done so that you can start typing immediately after solving a question instead of using the mouse and clicking on the panel for typing 
- the `showEditMode` function was declared internally to `renderPanel` and i didnt feel the need to move it outside jusst so that it can be used in `togglePanel` instead the functionality was copied into it
- read pr and issue as well for one bug related to this 

### Miscellaneous
- `db.version(1).stores` : is used to access the 1st version of the database and to define the schema and indexes for this version of the db 
- `console` : log , debug and error are different from each other in their log lvl, visual presentation and intended purpose. they each use different node.js streams 
- `toLocaleDateString` : can have multiple country's format and in this `en-IN` makes it in dd mm yyyy format and it is explicitly stated here for month to be of type short which means short forms of months (Ex: Aug)
- an export function using other functions in the script need not require those helper functions to be of export type as well 
- since it is difficult to compare complex objects, the `localeCompare` method is used 
- if you push a commit from a different branch which is present at origin then before pushing any new commit in main, you have to first fetch since the branches are different

### git and gh pr 
- **gh CLI installation and auth**
    - Installed via apt on WSL Ubuntu.
    - Confirmed WSL is not a blocker — browser-based auth either opens Windows' default browser automatically (if xdg-open is wired up) or falls  back to a device-code flow (manual: visit a URL, enter a code) — both are normal, not errors.
    - You were prompted with "How would you like to authenticate?" and ended up going through the personal access token path rather than browser/device-code — required manually generating a classic PAT at github.com/settings/tokens with scopes repo, read:org, admin:public_key, then pasting it into the terminal prompt (input hidden, which is normal).
    - Final auth output confirmed: git protocol set to SSH for github.com, reused an existing SSH key already linked to your account (id_ed25519), logged in as darklord241. Noted gh warned that credentials are stored in plain text on WSL (no OS keyring available) — acceptable tradeoff for a personal dev machine, just not to be treated as encrypted storage.
- **Git/gh workflow used:**
    1. `gh issue create` — filed the bug with title and root-cause description.
    2. `git checkout -b fix/cursor-jump-on-input` — new branch.
    3. Made the fix, committed with a message referencing the issue (fixes #1).
    4. `git push -u origin fix/cursor-jump-on-input` — first push of a new branch needs -u/--set-upstream to link local and remote branches for tracking, so future plain git push/git pull on this branch work without specifying the remote branch explicitly every time.
    5. `gh pr create --fill` — opened PR, auto-filled from the commit message.
    6. Reviewed with gh pr diff (prints the diff directly in-terminal — confirmed as the more useful command than gh pr view --web for actually reviewing code changes without a browser).
    7. Confirmed the diff was correct — all intended call sites updated, input listener correctly left untouched.
    8. `gh pr merge --squash` — merged.