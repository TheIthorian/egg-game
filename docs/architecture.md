# Architecture

## High-level structure

The project is built around one central coordinator and a few clear layers:

-   gameplay and UI objects that handle direct interaction
-   lightweight domain logic such as scoring
-   persistence that treats the URL as the source of durable state
-   supporting utilities for browser concerns and shared helpers

## Data flow

The main flow is simple:

1. The player interacts with the page.
2. State is written back into the URL.
3. The rest of the UI refreshes from that shared state.

This makes persistence and state management effectively the same concern in this project.

## Persistence design

All durable game state is kept together and stored in the URL. That choice shapes the rest of the system:

-   state needs to stay compact
-   state needs to stay serializable
-   compatibility matters because old links may still exist
-   invalid URL state has to be handled as normal input, not as an exceptional edge case

In practice, that durable state now includes both immediate play state and lightweight progression state, such as:

-   whether an egg is currently active
-   the current egg position
-   score
-   remaining egg inventory
-   number of eggs eaten

## Encryption boundary

Persistence and encoding are intentionally separated from the rest of the app. Most of the game should only care that state can be read and written, not how it is transformed for transport.

## UI architecture

The UI favors direct DOM manipulation and small stateful objects over declarative rendering. That keeps the project easy to reason about at its current size, even though it gives the application layer more responsibility for coordination.

The interface also includes multiple popup-style interactions with different responsibilities:

-   a score popup that reacts to score progression
-   a purchase popup that blocks egg restocking until the user explicitly confirms

## Significant constraints

-   The project is intentionally small and should not drift toward framework-level complexity.
-   State shape is important even though it is lightweight, because it doubles as the shareable save format.
-   URL-backed persistence is for transport and continuity, not for storing sensitive information.
-   Coordination is fairly centralized, so new cross-cutting behavior should be added carefully to avoid turning the app layer into a catch-all.
