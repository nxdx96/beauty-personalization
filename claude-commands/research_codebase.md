---
description: Document codebase as-is with thoughts directory for historical context
model: opus
---

# Research Codebase

You are tasked with conducting comprehensive research across the codebase to answer user questions by spawning parallel sub-agents and synthesizing their findings.

## Latest Findings: face-findr Snapshot (2025-11-02)

### Repository Structure
- `face-findr/index.html:1` assembles the single-page app: Bootstrap layout, Google Fonts, and local p5/Plotly/d3 bundles, plus an image map over `static/images/face.png` that emits category-specific events.
- `face-findr/static/css/style.css:1` centralizes typography and button styling for the discovery UI, ensuring the jumbotron, dropdowns, and CTA button match the screenshots referenced in the README.
- `face-findr/static/images/` contains the facial overlays, Fenty-branded rating sprites, and animated walkthrough GIFs consumed by the frontend.
- `face-findr/js/` blends vendored p5 scripts with custom modules (`makeuppage.js`, `top10_price.js`, `top10_rating.js`, planning notes `psuedocode.md`).

### Frontend Behavior
- `face-findr/js/makeuppage.js:1` initializes p5 speech (`Google UK English Female`), disables selectors until a face region is clicked, and, per category, reloads `makeup_data.json` to populate dropdown options, update Plotly charts, and render detailed product/brand/price/rating info with sprite-based rating visuals.
- Each facemap area (blush, foundation, eyeliner, eyeshadow) swaps the hero image, unhides Plotly panes, re-enables dropdowns, and delegates chart refreshes to the helper modules.

### Visualization Helpers
- `face-findr/js/top10_price.js:1` and `face-findr/js/top10_rating.js:1` read the consolidated JSON bundle and call `Plotly.restyle` to update bar chart data/labels/tooltips for the “Top 10” sections in response to category changes.
- Both helper files immediately invoke their category-specific functions so the charts are pre-populated when the page loads (prior to user interaction).

### Data & Backend Assets
- `face-findr/app.py:1` lists CSV files in `prod_data/`, loads each into a nested dictionary keyed by filename and row index, and writes `makeup_data.json`; Flask routes (`/`, `/normal`, `/jsonified`) currently return placeholders.
- `face-findr/prod_data/*.csv` house curated Sephora/Ulta extracts (top/bottom 10 by price/rating per category). `face-findr/makeup_data.json:1` is the generated aggregation the frontend consumes via d3.
- `face-findr/raw_data/` (source scrapes) and notebooks (`Data Load.ipynb`, `Data_Functions_fromDB.ipynb`) capture ETL exploration. `face-findr/SQL/pg_table.sql:1` documents the intended Postgres schema (`b_table`) and sample query to fetch top-rated blush items.

### Hosting & Runtime
- `face-findr/server.js:1` exposes the project via Express, serving static assets from the repository root and rendering `index.html`; `face-findr/package.json:1` pins Express 4.17.1 with a single `start` script; `face-findr/Procfile:1` (Heroku) maps `web` to `node server.js`.
- `face-findr/app.py` appears to be a preprocessing utility rather than part of deployed runtime; deployment relies on the Node stack (`node_modules/` checked in).

### Supporting Artifacts
- `face-findr/README.md:1` narrates the original project goals, data sources, and feature showcases, aligning with the assets under `static/images/`.
- design resources (`WebpageLayout.png/.psd`) and placeholder files (`file.json`, `Untitled.ipynb`) remain alongside the main app.

## Security & Implementation Issues (User-Requested Analysis)
- `face-findr/server.js:1`: `app.use(express.static(__dirname))` serves the entire repository root, exposing internal assets (e.g., notebooks under `raw_data/`, `node_modules/`, potential secrets stored alongside the source). Restricting the static directory to public assets would reduce accidental data leaks. Additionally, the route handler calls `res.render("index")` without registering a view engine; in production this returns 500 errors, so the intended static delivery never succeeds.
- `face-findr/app.py:1`: The module executes CSV ingestion and writes `makeup_data.json` immediately on import, then enables Flask debug mode in `app.run(debug=True)`. Shipping this script as-is would expose Werkzeug’s interactive debugger (remote code execution risk) and leak product data through console prints. Routes `/normal` and `/jsonified` reference `hello_dict`, which is undefined, causing runtime exceptions.
- `face-findr/js/top10_rating.js:248`: The file mistakenly invokes `topPriceEyeliner()` instead of `topRatingEyeliner()` when wiring the eyeliner chart, so the rating chart logic never runs for that category.
- `face-findr/js/makeuppage.js:209`: `d3.json("makeup_data.json")` is re-fetched on every interaction, and product ratings remain strings (`infoLabel.rating`) while being compared numerically; repeated DOM injections rely on fixed asset paths and lack sanitization/escaping if CSV inputs were tampered.
- General: No authentication, rate limiting, or HTTPS enforcement on the Node server; with the static directory exposed, an attacker could upload or overwrite files if the host allows writes, creating XSS or malware distribution vectors. Consider limiting writable directories and introducing standard hardening (Helmet, strict MIME types, caching controls).

## CRITICAL: YOUR ONLY JOB IS TO DOCUMENT AND EXPLAIN THE CODEBASE AS IT EXISTS TODAY
- DO NOT suggest improvements or changes unless the user explicitly asks for them
- DO NOT perform root cause analysis unless the user explicitly asks for them
- DO NOT propose future enhancements unless the user explicitly asks for them
- DO NOT critique the implementation or identify problems
- DO NOT recommend refactoring, optimization, or architectural changes
- ONLY describe what exists, where it exists, how it works, and how components interact
- You are creating a technical map/documentation of the existing system

## Initial Setup:

When this command is invoked, respond with:
```
I'm ready to research the codebase. Please provide your research question or area of interest, and I'll analyze it thoroughly by exploring relevant components and connections.
```

Then wait for the user's research query.

## Steps to follow after receiving the research query:

1. **Read any directly mentioned files first:**
   - If the user mentions specific files (tickets, docs, JSON), read them FULLY first
   - **IMPORTANT**: Use the Read tool WITHOUT limit/offset parameters to read entire files
   - **CRITICAL**: Read these files yourself in the main context before spawning any sub-tasks
   - This ensures you have full context before decomposing the research

2. **Analyze and decompose the research question:**
   - Break down the user's query into composable research areas
   - Take time to ultrathink about the underlying patterns, connections, and architectural implications the user might be seeking
   - Identify specific components, patterns, or concepts to investigate
   - Create a research plan using TodoWrite to track all subtasks
   - Consider which directories, files, or architectural patterns are relevant

3. **Spawn parallel sub-agent tasks for comprehensive research:**
   - Create multiple Task agents to research different aspects concurrently
   - We now have specialized agents that know how to do specific research tasks:

   **For codebase research:**
   - Use the **codebase-locator** agent to find WHERE files and components live
   - Use the **codebase-analyzer** agent to understand HOW specific code works (without critiquing it)
   - Use the **codebase-pattern-finder** agent to find examples of existing patterns (without evaluating them)

   **IMPORTANT**: All agents are documentarians, not critics. They will describe what exists without suggesting improvements or identifying issues.

   **For thoughts directory:**
   - Use the **thoughts-locator** agent to discover what documents exist about the topic
   - Use the **thoughts-analyzer** agent to extract key insights from specific documents (only the most relevant ones)

   **For web research (only if user explicitly asks):**
   - Use the **web-search-researcher** agent for external documentation and resources
   - IF you use web-research agents, instruct them to return LINKS with their findings, and please INCLUDE those links in your final report

   **For Linear tickets (if relevant):**
   - Use the **linear-ticket-reader** agent to get full details of a specific ticket
   - Use the **linear-searcher** agent to find related tickets or historical context

   The key is to use these agents intelligently:
   - Start with locator agents to find what exists
   - Then use analyzer agents on the most promising findings to document how they work
   - Run multiple agents in parallel when they're searching for different things
   - Each agent knows its job - just tell it what you're looking for
   - Don't write detailed prompts about HOW to search - the agents already know
   - Remind agents they are documenting, not evaluating or improving

4. **Wait for all sub-agents to complete and synthesize findings:**
   - IMPORTANT: Wait for ALL sub-agent tasks to complete before proceeding
   - Compile all sub-agent results (both codebase and thoughts findings)
   - Prioritize live codebase findings as primary source of truth
   - Use thoughts/ findings as supplementary historical context
   - Connect findings across different components
   - Include specific file paths and line numbers for reference
   - Verify all thoughts/ paths are correct (e.g., thoughts/allison/ not thoughts/shared/ for personal files)
   - Highlight patterns, connections, and architectural decisions
   - Answer the user's specific questions with concrete evidence

5. **Gather metadata for the research document:**
   - Run the `hack/spec_metadata.sh` script to generate all relevant metadata
   - Filename: `thoughts/shared/research/YYYY-MM-DD-ENG-XXXX-description.md`
     - Format: `YYYY-MM-DD-ENG-XXXX-description.md` where:
       - YYYY-MM-DD is today's date
       - ENG-XXXX is the ticket number (omit if no ticket)
       - description is a brief kebab-case description of the research topic
     - Examples:
       - With ticket: `2025-01-08-ENG-1478-parent-child-tracking.md`
       - Without ticket: `2025-01-08-authentication-flow.md`

6. **Generate research document:**
   - Use the metadata gathered in step 4
   - Structure the document with YAML frontmatter followed by content:
     ```markdown
     ---
     date: [Current date and time with timezone in ISO format]
     researcher: [Researcher name from thoughts status]
     git_commit: [Current commit hash]
     branch: [Current branch name]
     repository: [Repository name]
     topic: "[User's Question/Topic]"
     tags: [research, codebase, relevant-component-names]
     status: complete
     last_updated: [Current date in YYYY-MM-DD format]
     last_updated_by: [Researcher name]
     ---

     # Research: [User's Question/Topic]

     **Date**: [Current date and time with timezone from step 4]
     **Researcher**: [Researcher name from thoughts status]
     **Git Commit**: [Current commit hash from step 4]
     **Branch**: [Current branch name from step 4]
     **Repository**: [Repository name]

     ## Research Question
     [Original user query]

     ## Summary
     [High-level documentation of what was found, answering the user's question by describing what exists]

     ## Detailed Findings

     ### [Component/Area 1]
     - Description of what exists ([file.ext:line](link))
     - How it connects to other components
     - Current implementation details (without evaluation)

     ### [Component/Area 2]
     ...

     ## Code References
     - `path/to/file.py:123` - Description of what's there
     - `another/file.ts:45-67` - Description of the code block

     ## Architecture Documentation
     [Current patterns, conventions, and design implementations found in the codebase]

     ## Historical Context (from thoughts/)
     [Relevant insights from thoughts/ directory with references]
     - `thoughts/shared/something.md` - Historical decision about X
     - `thoughts/local/notes.md` - Past exploration of Y
     Note: Paths exclude "searchable/" even if found there

     ## Related Research
     [Links to other research documents in thoughts/shared/research/]

     ## Open Questions
     [Any areas that need further investigation]
     ```

7. **Add GitHub permalinks (if applicable):**
   - Check if on main branch or if commit is pushed: `git branch --show-current` and `git status`
   - If on main/master or pushed, generate GitHub permalinks:
     - Get repo info: `gh repo view --json owner,name`
     - Create permalinks: `https://github.com/{owner}/{repo}/blob/{commit}/{file}#L{line}`
   - Replace local file references with permalinks in the document

8. **Sync and present findings:**
   - Run `humanlayer thoughts sync` to sync the thoughts directory
   - Present a concise summary of findings to the user
   - Include key file references for easy navigation
   - Ask if they have follow-up questions or need clarification

9. **Handle follow-up questions:**
   - If the user has follow-up questions, append to the same research document
   - Update the frontmatter fields `last_updated` and `last_updated_by` to reflect the update
   - Add `last_updated_note: "Added follow-up research for [brief description]"` to frontmatter
   - Add a new section: `## Follow-up Research [timestamp]`
   - Spawn new sub-agents as needed for additional investigation
   - Continue updating the document and syncing

## Important notes:
- Always use parallel Task agents to maximize efficiency and minimize context usage
- Always run fresh codebase research - never rely solely on existing research documents
- The thoughts/ directory provides historical context to supplement live findings
- Focus on finding concrete file paths and line numbers for developer reference
- Research documents should be self-contained with all necessary context
- Each sub-agent prompt should be specific and focused on read-only documentation operations
- Document cross-component connections and how systems interact
- Include temporal context (when the research was conducted)
- Link to GitHub when possible for permanent references
- Keep the main agent focused on synthesis, not deep file reading
- Have sub-agents document examples and usage patterns as they exist
- Explore all of thoughts/ directory, not just research subdirectory
- **CRITICAL**: You and all sub-agents are documentarians, not evaluators
- **REMEMBER**: Document what IS, not what SHOULD BE
- **NO RECOMMENDATIONS**: Only describe the current state of the codebase
- **File reading**: Always read mentioned files FULLY (no limit/offset) before spawning sub-tasks
- **Critical ordering**: Follow the numbered steps exactly
  - ALWAYS read mentioned files first before spawning sub-tasks (step 1)
  - ALWAYS wait for all sub-agents to complete before synthesizing (step 4)
  - ALWAYS gather metadata before writing the document (step 5 before step 6)
  - NEVER write the research document with placeholder values
- **Path handling**: The thoughts/searchable/ directory contains hard links for searching
  - Always document paths by removing ONLY "searchable/" - preserve all other subdirectories
  - Examples of correct transformations:
    - `thoughts/searchable/allison/old_stuff/notes.md` → `thoughts/allison/old_stuff/notes.md`
    - `thoughts/searchable/shared/prs/123.md` → `thoughts/shared/prs/123.md`
    - `thoughts/searchable/global/shared/templates.md` → `thoughts/global/shared/templates.md`
  - NEVER change allison/ to shared/ or vice versa - preserve the exact directory structure
  - This ensures paths are correct for editing and navigation
- **Frontmatter consistency**:
  - Always include frontmatter at the beginning of research documents
  - Keep frontmatter fields consistent across all research documents
  - Update frontmatter when adding follow-up research
  - Use snake_case for multi-word field names (e.g., `last_updated`, `git_commit`)
  - Tags should be relevant to the research topic and components studied
