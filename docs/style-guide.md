# Style Guide

This guide documents the repository's code style. New code should fit these patterns unless there is a good reason to improve them deliberately.

## Language and formatting

-   Use TypeScript for application code.
-   Prefer named exports for classes and helpers.

## Module structure

-   Keep files small and focused on one responsibility.
-   Prefer one primary class or a small set of related helpers per file.
-   Use barrel exports only for clear module groupings such as `src/components/index.ts`, `src/database/index.ts`, and `src/encryption/index.ts`.
-   Keep browser-specific code near the edge of the system, but use small interfaces when it improves testability. E.g. `IUrlManager`.

## Component conventions

UI code is class-based and imperative.

-   Components should expose an `insert(parent: HTMLElement)` method that appends DOM to a parent and returns `this`.
-   Store the root DOM node on the class instance.
-   Expose small imperative methods instead of introducing a full reactive framework.
-   Keep component responsibilities narrow: display, input handling, or one game object.

## State and behavior

-   Put cross-component logic in `App` or a small service such as `ScoreService`.
-   Keep persistence writes inside `UrlDatabase` rather than spreading URL mutation logic across the codebase.
-   Prefer serializable plain data in state.
-   Use async database APIs consistently, even when the current implementation is lightweight.

## Utility design

-   Shared math, encoding, or browser helpers belong in `src/util.ts` or a similarly focused helper file.
-   Keep helpers simple and side-effect free when possible.
-   If a helper is stateful, isolate that state clearly as in `createDebouncer()`.

## Testing style

-   Test behavior through public APIs, not internal implementation details.
-   Mock browser-coupled seams with small in-memory doubles. `MockUrlManager` in the database tests is the pattern to follow.
-   Prefer targeted unit tests around persistence, encoding, and service logic before introducing broader integration coverage.

## Guidance for new work

-   Preserve the existing architectural direction unless you are intentionally refactoring it.
-   If adding a new feature, decide first whether it belongs in:
    -   a component
    -   `App`
    -   a service
    -   persistence or utility code
-   Avoid adding hidden global coupling beyond the existing `window` event model.
-   If you need richer shared state, add a typed state model instead of letting ad hoc keys spread further.

## Current code smells to be aware of

These are not reasons to block changes, but they are worth noticing when extending the code:

-   Some imports use path aliases informally, for example `'components/game-mode-toggle'` and `'types'`, while most code uses relative imports.
-   Some component code logs to the console and binds listeners inline.
-   There is no cleanup/unmount contract for components.

New code should avoid amplifying these issues.
