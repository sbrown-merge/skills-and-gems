---
created: 2026-09-21T08:09:03 (UTC -04:00)
tags: []
source: https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices
author: 
---

# Prompting best practices - Claude Platform Docs

> ## Excerpt
> Comprehensive guide to prompt engineering techniques for Claude's latest models, covering clarity, examples, XML structuring, thinking, and agentic systems.This is the reference for prompt engineering

---
Comprehensive guide to prompt engineering techniques for Claude's latest models, covering clarity, examples, XML structuring, thinking, and agentic systems.

This is the reference for prompt engineering with current Claude models, including Claude Fable 5.1, Claude Mythos 5.1, Claude Fable 5, Claude Mythos 5, Claude Opus 5, Claude Opus 4.8, Claude Opus 4.7, Claude Opus 4.6, Claude Sonnet 5, Claude Sonnet 4.6, and Claude Haiku 4.5. The page is organized in three parts:

-   **[Model-specific guidance](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#model-specific-guidance)** first: where a single model behaves differently and what to change in your prompt.
-   **Techniques for all current models** after that: general principles, output and formatting, tool use, thinking, and agentic systems.
-   **Migration considerations** last, for prompts moving from earlier generations.

## Model-specific guidance

Each of these models has its own prompting page. Read the one for your model first, then the techniques that follow.

| Model | Guide | What's different |
|----------------------------------------|----------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| Claude Fable 5.1 and Claude Mythos 5.1 | [Prompting Claude Fable 5.1](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1) | Differences from Claude Fable 5: effort levels, finishing long tasks, user-facing progress updates, passing thinking blocks back unchanged, tool-call batching in agent loops, search triggering at low effort, formatting, and writing density. |
| Claude Fable 5 and Claude Mythos 5 | [Prompting Claude Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5) | Differences from Claude Opus 4.8: effort levels, instruction following, long-run progress claims, memory systems, and the `reasoning_extraction` refusal category. |
| Claude Sonnet 5 | [Prompting Claude Sonnet 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5) | Differences from Claude Sonnet 4.6: response length, effort and thinking-depth calibration, tool use triggering, literal instruction following, and design and frontend defaults. |
| Claude Opus 5 | [Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5) | Differences from prior Opus models: response length and verbosity, user-facing progress updates, written deliverable length, task scope and over-verification, subagent control, and self-correction. |
| Claude Opus 4.8 | [Prompting Claude Opus 4.8](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-4-8) | Response length, effort and thinking-depth calibration, tool use triggering, literal instruction following, subagent control, and design and frontend defaults. |

## General principles

The techniques in this section and the sections that follow apply to current Claude models, including Claude Fable 5.1, Claude Mythos 5.1, Claude Fable 5, and Claude Mythos 5. Where a technique names a specific model, treat it as measured on that model and re-check it against your own evals before applying it to another.

### Be clear and direct

Claude responds well to clear, explicit instructions. Being specific about your desired output can help enhance results. If you want "above and beyond" behavior, explicitly request it rather than relying on the model to infer this from vague prompts.

Think of Claude as a brilliant but new employee who lacks context on your norms and workflows. The more precisely you explain what you want, the better the result.

**Golden rule:** Show your prompt to a colleague with minimal context on the task and ask them to follow it. If they'd be confused, Claude will be too.

-   Be specific about the desired output format and constraints.
-   Provide instructions as sequential steps using numbered lists or bullet points when the order or completeness of steps matters.

### Add context to improve performance

Providing context or motivation behind your instructions, such as explaining to Claude why such behavior is important, can help Claude better understand your goals and deliver more targeted responses.

Claude is smart enough to generalize from the explanation.

### Use examples effectively

Examples are one of the most reliable ways to steer Claude's output format, tone, and structure. A few well-crafted examples (known as few-shot or multishot prompting) improve accuracy and consistency.

When adding examples, make them:

-   **Relevant:** Mirror your actual use case closely.
-   **Diverse:** Cover edge cases and vary enough that Claude doesn't pick up unintended patterns.
-   **Structured:** Wrap examples in `<example>` tags (multiple examples in `<examples>` tags) so Claude can distinguish them from instructions.

### Structure prompts with XML tags

XML tags help Claude parse complex prompts unambiguously, especially when your prompt mixes instructions, context, examples, and variable inputs. Wrapping each type of content in its own tag (for example, `<instructions>`, `<context>`, `<input>`) reduces misinterpretation.

Best practices:

-   Use consistent, descriptive tag names across your prompts.
-   Nest tags when content has a natural hierarchy (documents inside `<documents>`, each inside `<document index="n">`).

### Give Claude a role

Setting a role in the system prompt focuses Claude's behavior and tone for your use case. Even a single sentence makes a difference:

### Long context prompting

When working with large documents or data-rich inputs (20k+ tokens), structure your prompt carefully to get the best results:

-   **Put longform data at the top:** Place your long documents and inputs near the top of your prompt, above your query, instructions, and examples. This improves performance across all models.
    
    
    
    Queries at the end can improve response quality by up to 30 percent in tests, especially with complex, multidocument inputs.
    
-   **Structure document content and metadata with XML tags:** When using multiple documents, wrap each document in `<document>` tags with `<document_content>` and `<source>` (and other metadata) subtags for clarity.
    
    ### Example multidocument structure
    
    ```php
    <documents>
      <document index="1">
        <source>annual_report_2023.pdf</source>
        <document_content>
          {{ANNUAL_REPORT}}
        </document_content>
      </document>
      <document index="2">
        <source>competitor_analysis_q2.xlsx</source>
        <document_content>
          {{COMPETITOR_ANALYSIS}}
        </document_content>
      </document>
    </documents>
    
    Analyze the annual report and competitor analysis. Identify strategic advantages and recommend Q3 focus areas.
    ```
    
    
    
-   **Ground responses in quotes:** For long document tasks, ask Claude to quote relevant parts of the documents first before carrying out its task. This helps Claude focus on the relevant content and ignore the rest of the document.
    
    ### Example quote extraction
    
    ```php
    You are an AI physician's assistant. Your task is to help doctors diagnose possible patient illnesses.
    
    <documents>
      <document index="1">
        <source>patient_symptoms.txt</source>
        <document_content>
          {{PATIENT_SYMPTOMS}}
        </document_content>
      </document>
      <document index="2">
        <source>patient_records.txt</source>
        <document_content>
          {{PATIENT_RECORDS}}
        </document_content>
      </document>
      <document index="3">
        <source>patient01_appt_history.txt</source>
        <document_content>
          {{PATIENT01_APPOINTMENT_HISTORY}}
        </document_content>
      </document>
    </documents>
    
    Find quotes from the patient records and appointment history that are relevant to diagnosing the patient's reported symptoms. Place these in <quotes> tags. Then, based on these quotes, list all information that would help the doctor diagnose the patient's symptoms. Place your diagnostic information in <info> tags.
    ```
    
    
    

### Model self-knowledge

If you would like Claude to identify itself correctly in your application or use specific API strings:

For LLM-powered apps that need to specify model strings:

## Output and formatting

### Communication style and verbosity

Claude's latest models have a more concise and natural communication style compared to previous models:

-   **More direct and grounded:** Provides fact-based progress reports rather than self-celebratory updates
-   **More conversational:** Slightly more fluent and colloquial, less machine-like
-   **Less verbose:** May skip detailed summaries for efficiency unless prompted otherwise

This means Claude may skip verbal summaries after tool calls, jumping directly to the next action. If you prefer more visibility into its reasoning:

Claude Opus 5 is an exception on verbosity: its default user-facing responses run longer than prior models', and raising or lowering [effort](https://platform.claude.com/docs/en/build-with-claude/effort) does not reliably change visible response length. Prompt explicitly for conciseness instead. See [Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#response-length-and-verbosity) for a sample instruction. Claude Fable 5.1 has the opposite tendency during agentic work: it writes fewer user-facing updates between tool calls. Ask for progress text explicitly, and remove any instruction telling it to keep that text brief. See [Ask for user-facing progress updates](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#ask-for-user-facing-progress-updates).

### Control the format of responses

There are a few particularly effective ways to steer output formatting:

1.  **Tell Claude what to do instead of what not to do**
    
    -   Instead of: "Do not use markdown in your response"
    -   Try: "Your response should be composed of smoothly flowing prose paragraphs."
2.  **Use XML format indicators**
    
    -   Try: "Write the prose sections of your response in <smoothly\_flowing\_prose\_paragraphs> tags."
3.  **Match your prompt style to the desired output**
    
    The formatting style used in your prompt may influence Claude's response style. If you are still experiencing steerability issues with output formatting, try matching your prompt style to your desired output style as closely as possible. For example, removing markdown from your prompt can reduce the volume of markdown in the output.
    
4.  **Use detailed prompts for specific formatting preferences**
    
    For more control over markdown and formatting usage, provide explicit guidance:
    

Claude Fable 5.1 already formats less than earlier models, so on that model a block like this can suppress structure the content needs. Remove it, or replace it with the shorter rule in [Formatting in chat](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#formatting-in-chat).

### LaTeX output

Claude's latest models default to LaTeX for mathematical expressions, equations, and technical explanations. If you prefer plain text, add the following instructions to your prompt:

### Document creation

Claude's latest models create presentations, animations, and visual documents with strong instruction following, and usually produce usable output on the first try.

For best results with document creation:

### Migrating away from prefilled responses

Starting with Claude 4.6 models and [Claude Mythos Preview](https://anthropic.com/glasswing), prefilled responses (providing a partial assistant message for Claude to continue from) on the last assistant turn are no longer supported. Requests with prefilled assistant messages to these models return a 400 error. Model intelligence and instruction following have advanced such that most use cases of prefill no longer require it. Earlier models continue to support prefills, and adding assistant messages elsewhere in the conversation is not affected.

Here are common prefill scenarios and how to migrate away from them:

## Tool use

### Tool usage

Claude's latest models are trained for precise instruction following and benefit from explicit direction to use specific tools. If you say "can you suggest some changes," Claude will sometimes provide suggestions rather than implementing them, even if making changes might be what you intended. To learn how to define tools and troubleshoot tool triggering, see [Tool use with Claude](https://platform.claude.com/docs/en/agents-and-tools/tool-use/overview).

For Claude to take action, be more explicit:

To make Claude more proactive about taking action by default, you can add this to your system prompt:

On the other hand, if you want the model to be more hesitant by default, less prone to jumping straight into implementations, and only take action if requested, you can steer this behavior with a prompt like the following:

Claude Opus 4.5 and Claude Opus 4.6 are also more responsive to the system prompt than previous models. If your prompts were designed to reduce undertriggering on tools or skills, these models may now overtrigger. The fix is to dial back any aggressive language. Where you might have said "CRITICAL: You MUST use this tool when...", you can use more normal prompting like "Use this tool when...".

### Optimize parallel tool calling

Claude's latest models run independent tool calls in parallel. These models will:

-   Run multiple speculative searches during research
-   Read several files at once to build context faster
-   Run bash commands in parallel (which can even bottleneck system performance)

This behavior is steerable. While the model has a high success rate in parallel tool calling without prompting, you can boost this to ~100% or adjust the aggression level:

On Claude Fable 5.1 in long agent loops, send the parallel-calls instruction as a turn-scoped system message after each round of tool results. See [Batch independent tool calls in agent loops](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#batch-independent-tool-calls-in-agent-loops).

## Thinking and reasoning

### Overthinking and excessive thoroughness

Claude Opus 4.6 does more upfront exploration than previous models, especially at higher [`effort`](https://platform.claude.com/docs/en/build-with-claude/effort) settings. This initial work often helps to optimize the final results, but the model may gather extensive context or pursue multiple threads of research without being prompted. If your prompts previously encouraged the model to be more thorough, you should tune that guidance for Claude Opus 4.6:

-   **Replace blanket defaults with more targeted instructions.** Instead of "Default to using \[tool\]," add guidance like "Use \[tool\] when it would enhance your understanding of the problem."
-   **Remove over-prompting.** Tools that undertriggered in previous models are likely to trigger appropriately now. Instructions like "If in doubt, use \[tool\]" will cause overtriggering.
-   **Use effort as a fallback.** If Claude continues to be overly aggressive, use a lower setting for `effort`.

In some cases, Claude Opus 4.6 may think extensively, which can inflate thinking tokens and slow down responses. If this behavior is undesirable, you can add explicit instructions to constrain its reasoning, or you can lower the `effort` setting to reduce overall thinking and token usage.

If you need a hard ceiling on thinking costs, extended thinking with a `budget_tokens` cap is still functional on Opus 4.6 and Sonnet 4.6 but is deprecated. On Claude 4.7 and later models, setting `budget_tokens` returns a 400 error. Prefer lowering the [effort](https://platform.claude.com/docs/en/build-with-claude/effort) setting or using `max_tokens` as a hard limit with [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/thinking).

### Leverage thinking & interleaved thinking capabilities

Claude's latest models offer thinking capabilities that can be especially helpful for tasks involving reflection after tool use or complex multistep reasoning. You can guide its initial or interleaved thinking for better results.

Claude 4.6 and later models and Claude Mythos Preview use [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) (`thinking: {type: "adaptive"}`), where Claude dynamically decides when and how much to think. On Claude Fable 5.1, Claude Mythos 5.1, Claude Fable 5, and Claude Mythos 5, thinking is always on and adaptive thinking is the only mode. Claude calibrates its thinking based on two factors: the `effort` parameter and query complexity. Higher effort elicits more thinking, and more complex queries do the same. On easier queries that don't require thinking, the model responds directly. In internal evaluations, adaptive thinking reliably drives better performance than extended thinking. Consider moving to adaptive thinking.

Use adaptive thinking for workloads that require agentic behavior such as multistep tool use, complex coding tasks, and long-horizon agent loops. Older models use manual [extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) with `budget_tokens`; see the [per-model configuration table](https://platform.claude.com/docs/en/build-with-claude/thinking-troubleshooting#supported-models) for which configuration each model accepts.

You can guide Claude's thinking behavior:

The triggering behavior for adaptive thinking is promptable. If you find the model thinking more often than you'd like, which can happen with large or complex system prompts, add guidance to steer it:

If you are migrating from [extended thinking](https://platform.claude.com/docs/en/build-with-claude/extended-thinking) with `budget_tokens`, replace your thinking configuration and move budget control to `effort`. The following examples show the same request before and after the migration (see [effort](https://platform.claude.com/docs/en/build-with-claude/effort) for the available levels and per-model availability):

If you are not using extended thinking, no changes are required. On Claude Opus 4.6 through Claude Opus 4.8 and Claude Sonnet 4.6, thinking is off when you omit the `thinking` parameter. On Claude Opus 5 and Claude Sonnet 5, thinking is on by default when you omit the `thinking` parameter. On Claude Opus 5, you can disable it only at effort `high` or lower. On Claude Fable 5.1, Claude Mythos 5.1, Claude Fable 5, and Claude Mythos 5, thinking is always on, regardless of whether you set the `thinking` parameter.

-   **Prefer general instructions over prescriptive steps.** A prompt like "think thoroughly" often produces better reasoning than a hand-written step-by-step plan. Claude's reasoning frequently exceeds what a human would prescribe.
-   **Multishot examples work with thinking.** Use `<thinking>` tags inside your few-shot examples to show Claude the reasoning pattern. It will generalize that style to its own extended thinking blocks.
-   **Manual chain-of-thought (CoT) prompting as a fallback.** When thinking is off, you can still encourage step-by-step reasoning by asking Claude to think through the problem. Use structured tags like `<thinking>` and `<answer>` to cleanly separate reasoning from the final output. On Claude Opus 5, prefer keeping thinking enabled at a lower effort level instead: with thinking disabled, the model can occasionally emit internal XML tags into its visible output, so see [Running with thinking disabled](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#running-with-thinking-disabled) before applying this pattern there.
-   **Ask Claude to self-check.** Append something like "Before you finish, verify your answer against \[test criteria\]." This catches errors reliably, especially for coding and math. Claude Opus 5 is the exception: it verifies its own work well without explicit instruction, and verification instructions carried over from prompts tuned for earlier models can cause over-verification, adding tokens and latency. When migrating to Claude Opus 5, remove these instructions rather than rewriting them. See [Task scope and over-verification](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#task-scope-and-over-verification).

## Agentic systems

### Long-horizon reasoning and state tracking

Claude's latest models handle long-horizon reasoning tasks with strong state tracking. Claude maintains orientation across extended sessions by focusing on incremental progress, making steady advances on a few things at a time rather than attempting everything at once. This capability especially emerges over multiple context windows or task iterations, where Claude can work on a complex task, save the state, and continue with a fresh context window.

#### Context awareness and multiwindow workflows

Claude Sonnet 5, Claude Sonnet 4.6, Claude Sonnet 4.5, and Claude Haiku 4.5 feature [context awareness](https://platform.claude.com/docs/en/build-with-claude/context-windows#context-awareness), enabling the model to track its remaining context window (that is, its "token budget") throughout a conversation. This enables Claude to execute tasks and manage context more effectively by understanding how much space it has to work.

**Managing context limits:**

If you are using Claude in an agent harness that compacts context or allows saving context to external files (like in Claude Code), consider adding this information to your prompt so Claude can behave accordingly. Otherwise, Claude may sometimes naturally try to wrap up work as it approaches the context limit. The following is an example prompt:

The [memory tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool) pairs well with context awareness for managing context transitions.

#### Workflows across multiple context windows

For tasks spanning multiple context windows:

1.  **Use a different prompt for the very first context window:** Use the first context window to set up a framework (write tests, create setup scripts), then use future context windows to iterate on a todo-list.
    
2.  **Have the model write tests in a structured format:** Ask Claude to create tests before starting work and keep track of them in a structured format (for example, `tests.json`). This leads to better long-term ability to iterate. Remind Claude of the importance of tests: "It is unacceptable to remove or edit tests because this could lead to missing or buggy functionality."
    
3.  **Set up quality of life tools:** Encourage Claude to create setup scripts (for example, `init.sh`) to gracefully start servers, run test suites, and linters. This prevents repeated work when continuing from a fresh context window.
    
4.  **Starting fresh versus compacting:** When a context window is cleared, consider starting with a brand new context window rather than using compaction. Claude's latest models are extremely effective at discovering state from the local filesystem. In some cases, you may want to take advantage of this over compaction. Be prescriptive about how it should start:
    
    -   "Call pwd; you can only read and write files in this directory."
    -   "Review progress.txt, tests.json, and the git logs."
    -   "Manually run through a fundamental integration test before moving on to implementing new features."
5.  **Provide verification tools:** As the length of autonomous tasks grows, Claude needs to verify correctness without continuous human feedback. Tools that let Claude verify UI work are helpful, such as the [computer use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/computer-use-tool), the [browser use tool](https://platform.claude.com/docs/en/agents-and-tools/tool-use/browser-use-tool), or a browser automation MCP server.
    
6.  **Encourage complete usage of context:** Prompt Claude to efficiently complete components before moving on:
    

#### State management best practices

-   **Use structured formats for state data:** When tracking structured information (like test results or task status), use JSON or other structured formats to help Claude understand schema requirements.
-   **Use unstructured text for progress notes:** Freeform progress notes work well for tracking general progress and context.
-   **Use git for state tracking:** Git provides a log of what's been done and checkpoints that can be restored. Claude's latest models perform especially well in using git to track state across multiple sessions.
-   **Emphasize incremental progress:** Explicitly ask Claude to keep track of its progress and focus on incremental work.

### Balancing autonomy and safety

Without guidance, Claude Opus 4.6 may take actions that are difficult to reverse or affect shared systems, such as deleting files, force-pushing, or posting to external services. If you want Claude Opus 4.6 to confirm before taking potentially risky actions, add guidance to your prompt:

### Research and information gathering

Claude's latest models can find and synthesize information from multiple sources effectively. For optimal research results:

1.  **Provide clear success criteria:** Define what constitutes a successful answer to your research question.
    
2.  **Encourage source verification:** Ask Claude to verify information across multiple sources.
    
3.  **For complex research tasks, use a structured approach:**
    

This structured approach helps Claude work through large corpora methodically and iteratively critique its findings.

### Subagent orchestration

Claude's latest models orchestrate subagents natively. These models can recognize when tasks would benefit from delegating work to specialized subagents and do so proactively without requiring explicit instruction.

To take advantage of this behavior:

1.  **Ensure well-defined subagent tools:** Have subagent tools available and described in tool definitions.
2.  **Let Claude orchestrate naturally:** Claude will delegate appropriately without explicit instruction.
3.  **Watch for overuse:** Claude Opus 4.6 has a strong predilection for subagents and may spawn them in situations where a simpler, direct approach would suffice. For example, the model may spawn subagents for code exploration when a direct grep call is faster and sufficient. Claude Opus 5 also delegates to subagents more readily than prior models; see [Controlling subagent spawning](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5#controlling-subagent-spawning) for guidance and a sample damping prompt.

If you're seeing excessive subagent use, add explicit guidance about when subagents are and aren't warranted:

### Chain complex prompts

With adaptive thinking and subagent orchestration, Claude handles most multistep reasoning internally. Explicit prompt chaining (breaking a task into sequential API calls) is still useful when you need to inspect intermediate outputs or enforce a specific pipeline structure.

The most common chaining pattern is **self-correction:** generate a draft → have Claude review it against criteria → have Claude refine based on the review. Each step is a separate API call so you can log, evaluate, or branch at any point.

### Reduce file creation in agentic coding

Claude's latest models may sometimes create new files for testing and iteration purposes, particularly when working with code. This approach allows Claude to use files, especially Python scripts, as a 'temporary scratchpad' before saving its final output. Using temporary files can improve outcomes particularly for agentic coding use cases.

If you'd prefer to minimize net new file creation, you can instruct Claude to clean up after itself:

### Overeagerness

Claude Opus 4.5 and Claude Opus 4.6 have a tendency to overengineer by creating extra files, adding unnecessary abstractions, or building in flexibility that wasn't requested. If you're seeing this undesired behavior, add specific guidance to keep solutions minimal.

For example:

### Avoid focusing on passing tests and hardcoding

Claude can sometimes focus too heavily on making tests pass at the expense of more general solutions, or may use workarounds like helper scripts for complex refactoring instead of using standard tools directly. To prevent this behavior and get solutions that generalize:

### Minimizing hallucinations in agentic coding

Claude's latest models are less prone to hallucinations and give more accurate, grounded, intelligent answers based on the code. To encourage this behavior even more and minimize hallucinations:

## Capability-specific tips

### Improved vision capabilities

Claude Opus 4.5 and Claude Opus 4.6 have improved vision capabilities compared to previous Claude models. They perform better on image processing and data extraction tasks, particularly when there are multiple images present in context. These improvements carry over to computer use, where the models can more reliably interpret screenshots and UI elements. You can also use these models to analyze videos by breaking them up into frames.

One technique that has proven effective to further boost performance is to give Claude a crop tool or [agent skill](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview). Testing has shown consistent uplift on image evaluations when Claude is able to "zoom" in on relevant regions of an image. Anthropic has created a [recipe for the crop tool](https://platform.claude.com/cookbook/multimodal-crop-tool).

### Frontend design

Claude Opus 4.5 and Claude Opus 4.6 build complex, real-world web applications with strong frontend design. However, without guidance, models can default to generic patterns that create what users call the "AI slop" aesthetic. To create distinctive, creative frontends that surprise and delight:

For frontend design work outside the API, [Claude Design](https://support.claude.com/en/articles/14604416-get-started-with-claude-design) provides a canvas and design tools where Claude generates and iterates on designs interactively.

Here's a system prompt snippet you can use to encourage better frontend design:

You can also refer to the [full skill definition](https://github.com/anthropics/claude-code/blob/main/plugins/frontend-design/skills/frontend-design/SKILL.md).

## Migration considerations

When migrating to current Claude models from earlier generations:

1.  **Be specific about desired behavior:** Consider describing exactly what you'd like to see in the output.
    
2.  **Frame your instructions with modifiers:** Adding modifiers that encourage Claude to increase the quality and detail of its output can help better shape Claude's performance. For example, instead of "Create an analytics dashboard", use "Create an analytics dashboard. Include as many relevant features and interactions as possible. Go beyond the basics to create a fully-featured implementation."
    
3.  **Request specific features explicitly:** Animations and interactive elements should be requested explicitly when desired.
    
4.  **Update thinking configuration:** Claude 4.6 models use [adaptive thinking](https://platform.claude.com/docs/en/build-with-claude/thinking) (`thinking: {type: "adaptive"}`) instead of manual thinking with `budget_tokens`. Use the [effort parameter](https://platform.claude.com/docs/en/build-with-claude/effort) to control thinking depth.
    
5.  **Migrate away from prefilled responses:** Prefilled responses on the last assistant turn are no longer supported starting with Claude 4.6 models and Claude Mythos Preview. See [Migrating away from prefilled responses](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-prompting-best-practices#migrating-away-from-prefilled-responses) for detailed guidance on alternatives.
    
6.  **Tune anti-laziness prompting:** If your prompts previously encouraged the model to be more thorough or use tools more aggressively, dial back that guidance. Claude 4.6 models are more proactive and may overtrigger on instructions that were needed for previous models.
    
7.  **Pass thinking blocks back unchanged and keep history append-only:** Append each assistant turn exactly as the API returned it, thinking blocks included. On Claude Fable 5.1, [modifying the conversation before a thinking block](https://platform.claude.com/docs/en/build-with-claude/thinking#preserved-in-conversation) results in an error, or in the block being dropped if you opt into that: editing earlier messages, rebuilding `system` or `tools`, or summarizing older turns in place between requests invalidates every later thinking block, so move those changes to mid-conversation system messages and server-side context management. See [Keep the conversation history append-only](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1#keep-the-conversation-history-append-only).
    

For detailed migration steps, see the [Migration guide](https://platform.claude.com/docs/en/about-claude/models/migration-guide).

### Migrating to Claude Sonnet 5 from Claude Sonnet 4.5 or earlier

See [Migrating to Claude Sonnet 5 from Claude Sonnet 4.5 or earlier](https://platform.claude.com/docs/en/models/sonnet-5/migration-guide#migrating-from-sonnet-45) in the migration guide, which covers the effort default change and the removal of manual extended thinking (`budget_tokens`).

## Next steps



[Prompting Claude Fable 5.1](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5-1)

Behavioral differences and prompting patterns for Claude Fable 5.1, covering effort, task completion, progress updates, thinking blocks, tool-call batching, and writing style.



[Prompting Claude Fable 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-fable-5)

Behavioral differences and prompting patterns for Claude Fable 5 and Claude Mythos 5, covering effort, instruction following, long runs, memory, and scaffolding changes.



[Prompting Claude Sonnet 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-sonnet-5)

Behavioral differences and prompting patterns for Claude Sonnet 5, covering effort, adaptive thinking defaults, tool use, and migration from Claude Sonnet 4.6.



[Prompting Claude Opus 5](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/prompting-claude-opus-5)

Behavioral differences and prompting patterns for Claude Opus 5, covering response verbosity, agentic narration, task scoping, subagent delegation, and self-correction.



[Prompt engineering overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview)

When to use prompt engineering and how to plan your approach before tuning prompts.
