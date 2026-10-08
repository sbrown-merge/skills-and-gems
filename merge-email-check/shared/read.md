### Step 3: Read

Run script 01 (layout), then script 02 (images). In script 01, `'__SCOPE_ID__'` is the scope script 00 returned. In both, `__EMAILS__` is the corrected `emails` array, keeping only each email's `name` and each frame's `id`, `role` and `dark`, and `__SETTINGS__` is step 1's value. Figma's agent rejects script code over 20,000 characters, so if a filled script is refused as too big, or a result is cut off, run it again for half the emails at a time.
