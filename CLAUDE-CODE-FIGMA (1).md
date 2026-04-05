---
title: Claude Code → Figma → Claude Code Roundtrip Tutorial
type: guide
status: active
created: 2026-02-18
related: unsplash/app/, unsplash/TUTORIAL.md

human_author: MDS
human_intent: Interactive tutorial any AI can run — walks a designer through the full code→figma→code roundtrip
human_context: Part of AI-native design curriculum. Designed for Shift Nudge students who have never used a terminal.

ai_model: Claude Opus 4.6
ai_updated: 2026-02-19
ai_notes: |
  Added AI Agent Instructions block so any AI reading this file
  acts as an interactive guide rather than dumping the document.
  Offers two paths: sample project or user's own idea.
  Human-readable tutorial below remains the reference material.
---

# Claude Code → Figma → Claude Code: The Complete Roundtrip

A step-by-step tutorial for building an app with Claude Code, sending it to Figma for design exploration, and rebuilding it from the Figma design. Written for someone who has never done any of this before.

---

## AI Agent Instructions

> **If you are an AI assistant reading this file:** This document is both a human-readable tutorial and an interactive guide you should follow with the user. Do NOT dump the full tutorial contents. Instead, walk the user through it step by step, acting as a hands-on guide.
>
> **Start by asking the user this question:**
>
> ---
>
> *This tutorial walks you through the Claude Code → Figma → Claude Code roundtrip — where AI builds a working app, you redesign it in Figma, and AI rebuilds it to match your design.*
>
> *Two options:*
>
> **Option A: Build the sample project** — I'll walk you through building a photo gallery app using picsum.photos. Good if you want to follow along step-by-step without thinking about what to build.
>
> **Option B: Describe your own project** — Tell me what you want to build (a landing page, portfolio, dashboard, pricing table, whatever) and I'll adapt the tutorial to your idea.
>
> *Which would you prefer?*
>
> ---
>
> **Then follow these rules:**
>
> 1. **Check prerequisites first.** Before building anything, verify Node.js (`node --version`), confirm they have a Figma account (ask — don't assume plan tier), and confirm Claude Code is working (you're already here if they're talking to you).
>
> 2. **One act at a time.** Walk through Act 1, Act 2, and Act 3 sequentially. Don't skip ahead. After each act, confirm the user is ready before continuing.
>
> 3. **If they chose Option A,** use the "Photo Gallery" prompt from Act 1 Step 2 below. Build it exactly as described.
>
> 4. **If they chose Option B,** take their description and construct a build prompt using this template:
>    ```
>    Build me a single-page [THEIR IDEA] using [APPROPRIATE DATA SOURCE IF NEEDED].
>    Stack: Vite + React 19 + Tailwind v4. No TypeScript, no router.
>    [THEIR SPECIFIC REQUIREMENTS]
>    After creating all files, run npm install and then npm run dev.
>    ```
>
> 5. **Do the work, don't just show prompts.** You are the AI — build the app directly. Don't tell the user to "paste this prompt into Claude Code." You ARE Claude Code. Create the files, run the installs, start the dev server.
>
> 6. **Pause at Act 2 transitions.** When it's time to set up the Figma MCP, walk them through it interactively. Check if they already have it configured (`/mcp`). If not, guide the install.
>
> 7. **Pause at Act 3 transitions.** Wait for the user to share their Figma URL before proceeding. Don't ask them to "paste a prompt" — just ask for the URL and handle the rest.
>
> 8. **Keep explanations conversational.** The detailed "What does mkdir mean?" notes below are for human readers. You can skip those and just do the thing, explaining only if the user seems confused.
>
> 9. **The tutorial below is your reference.** Use it for the correct technical steps, prompts, and troubleshooting — but deliver it as a live guided experience, not a document dump.

---

## What You'll Do

This tutorial walks through three acts:

1. **Act 1:** Ask Claude Code to build a web page from scratch
2. **Act 2:** Push the running page into Figma so you can explore design directions
3. **Act 3:** Pick a Figma design and ask Claude Code to rebuild the page to match it

By the end you'll have experienced the full loop: **AI builds → human designs → AI rebuilds**.

You can build anything you want — a portfolio page, a landing page, a photo gallery, a pricing table. This tutorial gives you starter prompts to choose from, but feel free to write your own.

---

## What You Need Before Starting

Before you touch anything else, make sure you have these three things. If you're missing any of them, handle that first.

### 1. Node.js (v18 or newer)

Node.js is what runs JavaScript outside a browser. You need it to run the app locally.

**Check if you have it:**

Open your terminal (on Mac: search for "Terminal" in Spotlight, or press `Cmd + Space` and type `Terminal`). Then type:

```
node --version
```

If you see something like `v20.11.0` or `v22.3.1` — you're good. Move on.

If you see `command not found` — you need to install it:
- Go to https://nodejs.org
- Click the big green button that says "LTS" (Long Term Support)
- Download it, open the installer, click through until it's done
- Close your terminal, open a new one, and run `node --version` again to confirm

### 2. A Figma Account (on a Paid Plan)

Figma is a design tool that runs in your browser. You need an account on at least a **Pro or Organization plan** (not the free Starter plan) to use the MCP features meaningfully.

- Go to https://figma.com
- Click "Get started for free" and create an account (or log in if you have one)
- **Important:** The Figma MCP server has rate limits based on your plan:
  - **Starter (free):** Only 6 MCP calls per month — not enough for this tutorial
  - **Pro or Organization:** 200 calls/day — plenty
  - **Enterprise:** 600 calls/day
- If you're on the free plan, you can still follow along, but you'll hit limits quickly. Consider starting a Pro trial (Figma offers a free trial period).

### 3. Claude Code (Installed and Working)

Claude Code is Anthropic's AI coding assistant that runs in your terminal. You need either a Claude Max subscription ($100/mo) or an Anthropic API key.

**Check if you have it:**

In your terminal, type:

```
claude --version
```

If you see a version number — you're good.

If you see `command not found`:
- Visit https://docs.anthropic.com/en/docs/claude-code/overview
- Follow the installation instructions for your operating system
- Come back here once `claude --version` works

### That's It

No API keys, no developer accounts, no extra signups. Just those three things.

---

## Act 1: Claude Code Builds the App

In this act, you'll ask Claude Code to build a web page from scratch. You don't write any code — Claude does all of it. You'll just copy-paste a prompt and say "yes" when Claude asks for permission to create files.

### Step 1: Create a Project Folder and Launch Claude Code

First, create a folder for your project and open Claude Code inside it. In your terminal:

```
mkdir ~/my-project
cd ~/my-project
claude
```

> **"What does `mkdir` mean?"** It's short for "make directory" — it creates a new folder. `cd` means "change directory" — it moves you into that folder. After that, `claude` launches Claude Code inside it.

You should see Claude's prompt appear — a cursor waiting for your input. It looks something like:

```
>
```

If Claude asks you to authenticate or set up anything, follow those prompts first.

### Step 2: Give Claude the Build Prompt

Now you'll tell Claude what to build. Pick one of the starter prompts below — or write your own. Copy and paste it into Claude Code.

> **"What are Vite, React, and Tailwind?"** These are tools that developers use to build web apps. You don't need to understand what they are — they're instructions for Claude, like telling a chef which pans to use. Just copy-paste the prompt exactly as written.

**Option A: Photo Gallery (recommended starter)**

```
Build me a single-page photo gallery app using picsum.photos for images.

Stack: Vite + React 19 + Tailwind v4. No TypeScript, no router.

The app should:
- Show a grid of 12 random photos from https://picsum.photos (use https://picsum.photos/600/400?random=1, ?random=2, etc.)
- Clicking a photo opens a larger detail view with the photo info
- Have a "Shuffle" button that loads new random photos
- Use a clean, minimal design with good spacing and subtle shadows

After creating all files, run npm install and then npm run dev.
```

**Option B: Landing Page**

```
Build me a single-page landing page for a fictional design tool called "PixelForge."

Stack: Vite + React 19 + Tailwind v4. No TypeScript, no router.

The page should have:
- A hero section with a bold headline, subheadline, and a "Get Started" button
- A features section with 3 cards (icons optional, use emoji if needed)
- A testimonials section with 3 fake quotes
- A footer with links
- Use a modern, clean design with a blue/indigo color palette

After creating all files, run npm install and then npm run dev.
```

**Option C: Write Your Own**

You can build anything. Just end your prompt with:

```
Stack: Vite + React 19 + Tailwind v4. No TypeScript, no router.
After creating all files, run npm install and then npm run dev.
```

That tells Claude which tools to use and to start the app when it's done.

### Step 3: Watch Claude Work

After you press Enter, Claude will:

1. Create each file one by one (you'll see it asking for permission to create/write files — say **yes** or press **y**)
2. Run `npm install` to download the app's building blocks (say **yes** when it asks to run the command)
3. Run `npm run dev` to start the app on your computer (say **yes** again)

**You'll see a lot of code and text scrolling by.** That's normal — Claude is writing the app in real time. You don't need to read or understand any of it. Just watch for the permission prompts and say yes.

This takes 1-2 minutes. When it's done, you should see output that includes something like:

```
VITE v6.x.x ready in 500 ms

➜  Local:   http://localhost:5173/
```

### Step 4: See Your App in the Browser

Open your web browser (Chrome, Safari, Firefox, Arc — any of them work).

Go to: **http://localhost:5173**

> **"What is localhost?"** It's your own computer acting as a temporary web server. The app isn't on the internet — it's running privately on your machine. `5173` is just the "door number" the app is listening on. This URL only works while the terminal is running.

You should see your app running — whatever you asked Claude to build. If it looks right, you're done with Act 1.

**If you see an error instead:**
- Check that the terminal still shows the Vite server running
- Tell Claude what error you see — paste the error message and ask it to fix it

**Leave this terminal running.** Don't close it, don't quit it. You need the app running at localhost:5173 for Act 2. (If you accidentally close it, see Troubleshooting at the bottom.)

---

## Act 2: Push the Running App into Figma

Now you'll connect Claude Code to Figma so it can capture your running app and turn it into an editable Figma design. This is the magic step — your running app becomes a fully editable Figma file with real layers, real text, and real structure.

> **Important:** This capture feature only works with **Claude Code** (the terminal app). It does NOT work with regular Claude on the web (claude.ai).

### Step 5: Install the Figma MCP Server

"MCP" stands for Model Context Protocol. It's how Claude Code connects to external tools like Figma. Think of it as a plugin system.

You now need **two terminal tabs** — one keeps your app running, and the other is where you'll talk to Claude. Think of it like having two browser tabs, but for the terminal.

Open a **new terminal tab** by pressing `Cmd + T` on Mac. (Your first tab with the running app stays untouched.)

Navigate to your project folder in this new tab:

```
cd ~/my-project
```

Run this command:

```
claude mcp add --transport http figma https://mcp.figma.com/mcp
```

That's it. If the command fails, you can add it manually by creating a file called `.mcp.json` in your project folder:

```json
{
  "mcpServers": {
    "figma": {
      "type": "http",
      "url": "https://mcp.figma.com/mcp"
    }
  }
}
```

> **What about Playwright?** You may see tutorials that mention a "Playwright MCP" for browser automation. **You do NOT need Playwright to capture your own localhost app.** The Figma capture works by adding a script tag to your HTML and opening a URL — no browser automation required. Playwright is only needed if you want to capture external websites you don't control (like stripe.com), and even then it doesn't work on all sites (ones with strict Content Security Policies will block it).

### Step 6: Restart Claude Code and Authenticate with Figma

The Figma connection won't activate until you restart Claude Code.

1. Go to the **second terminal tab** (NOT the first tab where your app is running)
2. Launch Claude Code:

```
cd ~/my-project
claude
```

3. Once Claude is running, type:

```
/mcp
```

4. You should see a list that includes **figma**.

5. **Figma** will likely show as **disconnected**. This is normal — it needs you to log in first.

6. Select **figma** from the list (use arrow keys to highlight it, then press Enter).

7. **Your web browser will open automatically** to a Figma page asking you to grant access. It will say something like "Allow Claude Code to access your Figma account?"

8. Click **"Allow access"** in the browser.

9. You'll see a confirmation page. You can close that browser tab.

10. Go back to your terminal. Type `/mcp` again to verify. **figma** should now show as **connected**.

**If figma still shows as disconnected:**
- Make sure you're logged into Figma in your default web browser
- Make sure you clicked "Allow access" (not "Deny") on the Figma consent page
- Try selecting figma from the `/mcp` list again to re-trigger the login flow

> **Note:** MCP servers can disconnect mid-session (especially after long idle periods). If Claude suddenly says it can't reach Figma, type `/mcp` to check the status and reconnect.

### Step 7: Ask Claude to Send Your App to Figma

This is where it all comes together. With your Vite server still running in the other terminal tab (at localhost:5173), give Claude this prompt:

```
I have a web app running at http://localhost:5173. Please capture it and send it to Figma as a new file. Add the Figma capture script to my index.html, then use the open command to trigger the capture with a 3-second delay so images have time to load.
```

**What happens next (step by step):**

1. Claude adds a `<script>` tag to your `index.html` that loads the Figma capture library. This is a one-line addition:
   ```html
   <script src="https://mcp.figma.com/mcp/html-to-design/capture.js" async></script>
   ```
2. Claude calls the Figma MCP's `generate_figma_design` tool to get a **capture ID** — a unique token for this capture session.
3. Claude runs an `open` command that opens your app in your default browser with special capture parameters in the URL hash (like `#figmacapture=abc123&figmadelay=3000`).
4. **Your browser opens**, the page loads, and after the 3-second delay the capture script automatically serializes the DOM and sends it to Figma.
5. Claude polls the capture ID to check when it's done.
6. Once complete, Claude returns a **Figma file URL**.

This takes 30-90 seconds. Be patient — you'll see Claude working through each step in the terminal.

**Want to capture multiple variations?** Make changes to the app (ask Claude to tweak colors, layout, content) and capture again. Each capture creates a new frame in Figma. Great for collecting several versions side by side.

**Want to capture multiple pages?** You can capture several screens in one session. Just tell Claude: "Capture this page to the same Figma file." Each page gets its own frame.

**If something goes wrong:**
- If Claude says it can't connect to the Figma MCP, type `/mcp` and verify figma shows as connected
- If the capture shows as "pending" and never completes, make sure the capture script tag is in your `index.html` — without it, the `open` command alone won't work
- If Claude asks you to choose a Figma team/plan to save the file under, it will show you a list — pick whichever team you want
- If nothing happens at all, make sure your Vite server is still running in the other terminal tab

### Step 8: Open Your Design in Figma

When Claude finishes, it will give you a URL. There are two things you might see:

**Option A — A direct Figma file URL** like:
```
https://figma.com/design/AbCdEf123/My-Project-Baseline
```
Click it and Figma opens with your design.

**Option B — A "claim" URL** like:
```
https://figma.com/integrations/claim/AbCdEf123
```
This is Figma asking you to accept the newly-created file into your account. Click it, accept, and the file opens. (You need to claim the file before you can edit it.)

You may also see an **"Open file"** button in the browser's capture toolbar — clicking that also takes you to the Figma file.

**What you'll see in Figma:**
- The full page layout as editable Figma frames and layers
- Text is real editable text (you can click on any text and change it)
- Images are placed as image fills
- The overall layout and structure matches what was on screen

> **Alternative: Clipboard mode.** If you'd rather paste into an existing Figma file instead of creating a new one, you can ask Claude: "Capture the page and copy it to my clipboard instead." Then switch to Figma and press `Cmd + V` to paste the captured design into any file you want.

### Step 9: Explore Design Directions in Figma

This is the human-driven creative step. No AI, no terminal — just you and Figma, the tool you already know.

The captured design is fully editable. Every text layer, every shape, every color is yours to change. Some things to try:
- Change the typography (try a serif font, try different sizes/weights)
- Experiment with layout (rearrange sections, try a sidebar, change the grid)
- Try different color palettes (dark mode? warm tones? neon accents?)
- Adjust spacing, padding, and proportions
- Try a completely different visual hierarchy

**The goal isn't pixel perfection — it's direction.** Pick a layout, a mood, a typographic approach. Claude will handle translating it back to code.

**When you have a direction you like, move on to Act 3.**

---

## Act 3: Claude Code Rebuilds From Your Figma Design

Now comes the roundtrip. The Figma MCP server works in both directions — it can push your app TO Figma (Act 2), and it can also read FROM Figma back into Claude Code. All you need is a link to a Figma frame and a prompt.

### Step 10: Get Your Figma Frame URL

You need to give Claude the URL of the specific frame you designed so it knows what to rebuild.

1. In Figma, click on the **top-level frame** of your new design (the outermost container that holds everything). You'll know you've selected it when you see a blue outline around the whole design and the frame name highlighted in the left sidebar.

2. Now look at your browser's address bar. The URL will have updated to include a `node-id` parameter. It will look something like:

```
https://figma.com/design/AbCdEf123/My-File?node-id=1-2
```

The `node-id=1-2` part tells Claude exactly which frame to look at. **This part is critical** — without it, Claude won't know which design to use.

3. **Select the entire URL** in your address bar and **copy it** (`Cmd + C` on Mac, `Ctrl + C` on Windows).

### Step 11: Ask Claude to Rebuild the App

Go back to your terminal where Claude Code is running. Paste this prompt, but **replace the example URL with the real URL you just copied:**

```
Here is my redesigned Figma mockup:

PASTE_YOUR_FIGMA_URL_HERE

Please:
1. Get a screenshot of this Figma frame so you can see the design
2. Get the design context (layout, colors, fonts, spacing) from Figma
3. Then rebuild src/App.jsx and src/index.css to match this design as closely as possible
4. Keep all existing functionality — only change the visual design
```

**Important:** Make sure you actually replace `PASTE_YOUR_FIGMA_URL_HERE` with your real URL. It should start with `https://figma.com/design/...`

### Step 12: Watch Claude Rebuild

Claude will work through this in several visible steps. Again, you don't need to understand the code it writes — just say "yes" when it asks for permission:

1. **Screenshot** — Claude calls Figma to take a screenshot of your frame so it can "see" your design.
2. **Design context** — Claude calls Figma again to get structured data: exact colors, font names, spacing values, layout structure. This is more precise than just the screenshot.
3. **Rewrite code** — Claude rewrites the app to match your design. You'll see it ask for permission to edit files — say **yes**.
4. **Live reload** — Your browser automatically shows the new design. You don't need to refresh — it just appears.

This takes 1-3 minutes depending on how different your Figma design is from the original.

### Step 13: Compare the Result

Go back to your browser at **http://localhost:5173**

The page should have automatically reloaded with the new design. Open your Figma file side by side with the browser and compare:

- Does the overall layout match? (column structure, element ordering)
- Are the colors right? (background, text, borders, accents)
- Is the typography correct? (font family, sizes, weights)
- Does the spacing feel the same? (padding, gaps between sections)

**It probably won't be pixel-perfect on the first pass.** That's normal and expected. Here's how to iterate:

If something isn't quite right, tell Claude specifically what needs fixing. Be precise — reference exact values from your Figma design:

```
Looking at my Figma design, a few things are off:
- The headline should be 32px, not 24px
- The cards should have a 2px solid black border
- The background should be #f5f0eb, not white
- The sections need more padding — about 24px on each side

Can you fix these?
```

Claude will make the adjustments and the page will hot-reload again. Repeat until you're happy.

---

## Troubleshooting

### "I closed my terminal and the app stopped working"

The Vite dev server only runs while the terminal is open. Open a new terminal, navigate to your project folder, and run:

```
cd ~/my-project
npm run dev
```

### "Claude says it can't connect to Figma"

1. Type `/mcp` in Claude Code
2. Check if "figma" shows as connected
3. If it shows as disconnected, select it and press Enter to re-trigger the login flow
4. Make sure you're logged into Figma in your default web browser before trying
5. After authenticating, type `/mcp` again to confirm it now shows connected

### "The Figma capture is blank or missing elements"

The page needs to be fully loaded before capture. Try asking Claude:

```
Open http://localhost:5173 in the browser, wait 5 seconds for everything to load, then capture and push to Figma.
```

### "Claude can't see my Figma design / says unauthorized"

- Make sure you copied the **full** Figma URL including the `?node-id=` part
- Make sure the Figma file is in a team/project that YOUR Figma account has access to
- Try running `/mcp`, selecting figma, and re-authenticating
- If you're on a free Starter plan, you may have hit the 6 calls/month limit — check your Figma plan

### "npm run dev gives an error about missing modules"

Run `npm install` first, then try `npm run dev` again:

```
cd ~/my-project
npm install
npm run dev
```

---

## Summary

| Act | Who Does the Work | What Happens |
|-----|-------------------|--------------|
| **Act 1** | Claude Code | Builds a working app from a text prompt |
| **Act 2** | You (in Figma) | Explore design directions on the real content |
| **Act 3** | Claude Code | Rebuilds the app to match your chosen Figma design |

The whole loop takes about 20-30 minutes. You didn't need to write a single line of code.

The key insight: **Claude is fast at building; you're fast at designing.** This workflow lets each of you do what you're best at. The same data, styled four different ways, becomes four different products. The data didn't change — the design intent did.

---

## Reference: What Got Installed

By the end of this tutorial, your project folder contains:

| Item | What it is |
|------|-----------|
| `package.json`, `node_modules/` | The app's dependencies (React, Vite, Tailwind) |
| `src/App.jsx`, `src/index.css` | The app code (what Claude wrote and rewrote) |
| `.mcp.json` | MCP server config (tells Claude how to reach Figma) |

Your Figma authentication is stored securely by Claude Code — you don't need to re-authenticate each session.

---

## Sources

This tutorial is based on:

- [From Claude Code to Figma: Turning Production Code into Editable Figma Designs](https://www.figma.com/blog/introducing-claude-code-to-figma/) — Figma blog, Feb 17 2026
- [Figma MCP Server: Tools and Prompts](https://developers.figma.com/docs/figma-mcp-server/tools-and-prompts/#generate_figma_design) — Figma developer docs
- [Guide to the Figma MCP Server](https://help.figma.com/hc/en-us/articles/32132100833559) — Figma help center
- [Figma MCP Remote Server Installation](https://developers.figma.com/docs/figma-mcp-server/remote-server-installation/) — Figma developer docs
- [Claude Code: Connect to Tools via MCP](https://code.claude.com/docs/en/mcp) — Anthropic docs
