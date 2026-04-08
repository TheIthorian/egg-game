# State, Persistence, and Testing

## Why this area matters

The distinctive part of this project is not the gameplay itself. It is the decision to use the URL as the durable home for runtime state.

## State storage model

The application treats state as one portable snapshot rather than a set of unrelated browser-side fragments. That keeps the save model easy to understand: if the URL is preserved, the session is preserved.

## Publication model

When state changes, the rest of the interface is expected to react from that shared source. The important idea is consistency: visible UI should follow persisted state, not drift away from it.

## URL persistence implications

Because the URL carries state:

-   state must remain JSON-serializable
-   large payloads will make the URL harder to share
-   changing persistence behavior can break old URLs
-   malformed or tampered state must be treated as expected input

## Encryption notes

State is transformed before being placed into the URL, but that transformation should be understood as obfuscation and transport support, not as strong security. This game should not rely on URL persistence for protecting sensitive data.

## Test coverage

Testing is most valuable around the parts of the system that are easiest to break without noticing: state round-tripping, persistence behavior, and the boundaries around encoded URL data.

## Recommended testing direction

-   Favor tests that protect session portability and state continuity.
-   Treat persistence changes as compatibility-sensitive work.
-   Add broader integration coverage only where multiple parts of the app have to cooperate to preserve gameplay behavior.
