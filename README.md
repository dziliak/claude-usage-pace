# usage-pace

A Claude Code mod that shows your 5-hour and weekly usage at the right of the prompt footer, with your pace and whether you'll reach the reset:

```
📊 usage-pace 5h 42% → 78% at reset 3:40 PM  ·  wk 61% ⚠ out Thu 2:15 PM, resets Sat 9:00 AM
```

- On pace: the percent you'll land on at the reset.
- Over pace: `⚠`, the time you'll run out, then the reset time.

Pace is the average over the whole window. The label is empty until the first response reports your limits, and off a subscription.

## Install

At the prompt of a terminal session:

```
/plugin install usage-pace --marketplace dziliak/claude-usage-pace
```

Answer `y` to add the marketplace, then pick a scope (user scope loads it in every session).

From a shell:

```
claude plugin install usage-pace --marketplace dziliak/claude-usage-pace
```

In the desktop app, where `/plugin` does not run: click + next to the prompt box, then Plugins, Add marketplace with `dziliak/claude-usage-pace`, then Add plugin.

This repository is private: it installs only for people who can read it on GitHub and whose machine already holds a git credential for github.com (an SSH key, or `gh auth login` then `gh auth setup-git`).
