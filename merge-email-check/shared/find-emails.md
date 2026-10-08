### Step 1: Find the emails and send the opening message

Run script 00 with `'__SCOPE_ID__'` set to the node in the person's link, if they gave one (`node-id=106-6` is `106:6`), or else to `''` (it uses the one selected layer) and `__SETTINGS__` set to `null`. If nothing usable is selected, it returns `currentPage` and the page list; rerun it with `currentPage`.
