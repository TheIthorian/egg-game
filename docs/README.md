# Docs

This directory explains what `egg-game` is, the main ideas behind it, and the broad conventions the codebase follows.

## What this project is

`egg-game` is a small browser game written in TypeScript. The player spawns an egg from the nest, drags it into the mouth, and earns score based on drag distance. The current session is stored in the URL so it can be shared or reopened later.

## Documents

-   [Project Overview](./project-overview.md): what the game is and the key ideas behind the player experience.
-   [Architecture](./architecture.md): the main parts of the system and how they relate to each other.
-   [Style Guide](./style-guide.md): the broad coding patterns the repository is built around.
-   [State, Persistence, and Testing](./state-persistence-and-testing.md): why state lives in the URL and what that means for changes.

## Suggested reading order

1. Start with `project-overview.md`.
2. Read `architecture.md` for a system-level view.
3. Read `style-guide.md` before extending the codebase.
4. Use `state-persistence-and-testing.md` when touching state or persistence.
