# Project Overview

## Summary

This project is a lightweight browser game with a deliberately simple shape. It runs directly in the browser, renders to the DOM without a framework, and keeps the player session portable by storing it in the URL.

## Core gameplay

-   The player creates an egg from the nest.
-   The egg is dragged across the page toward the goal.
-   A successful drop awards score.
-   The nest has a finite egg supply that depletes during play.
-   When eggs run out, the player is prompted to buy a new pack before continuing.
-   The run can be reset or switched between modes.
-   The current session can be revisited because progress is encoded into the URL.

## Product characteristics

-   Browser-first: the game is designed around a live DOM and direct user interaction.
-   Small-scale by design: the codebase favors straightforward imperative code over framework machinery.
-   Shareable sessions: the same mechanism that stores progress also makes a session easy to send or reopen.
-   State-driven UI: visible game information is derived from persisted state rather than treated as separate truth.
-   Session continuity includes inventory: score, egg supply, and related gameplay state travel together in the URL.

## What matters when changing it

-   Preserve the immediacy of the interaction. The game should remain simple to understand and quick to play.
-   Preserve portability. New state should continue to be safe to serialize and carry in a URL.
-   Keep new features proportional to the size of the project. Heavy abstractions are usually a poor fit here.
