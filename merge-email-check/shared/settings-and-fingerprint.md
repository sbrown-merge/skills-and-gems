Turn a changed house number into `__SETTINGS__` JSON with only the keys that change: `mobileWidth` and `desktopWidth` as `[min, max]`, `mobileDefault`, `desktopDefault`, `maxLength`, `previewArea`, `headline` as `[min, max]`, `bodyLineHeight` as `[min, max]`, `capsMaxChars`, `tapTarget`, `maxSlice`, `altCharPx`, `darkReference` as a hex string, `avoidPureBackgrounds` as true or false. If the widths change, rerun script 00 with them. A changed dark-mode policy is applied in step 4. Otherwise use `null`.

### Step 2: Fingerprint

Run script 03 with `__SCOPE_IDS__` set to a JSON array of the scope's ID, `__BASELINE__` to `null` and `__ADDED__` to `0`. Keep the result for step 6.
