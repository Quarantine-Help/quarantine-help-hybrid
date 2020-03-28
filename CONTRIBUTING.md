# Contributing
## How do I... 
- [Use This Guide](#introduction) ?
- Ask or Say Something? 🤔🐛😱
	- [Request Support](#request-support)
	- [Report an Error or Bug](#report-an-error-or-bug)
	- [Request a Feature](#request-a-feature)
- Make Something? 🤓👩🏽‍💻📜🍳
	- [Project Setup](#project-setup)
	- [Contribute Code](#contribute-code)
	- [Label Issues](#label-issues)
- Add a Guide Like This One [To My Project](#attribution)? 🤖😻👻

## Introduction

Thank you so much for your interest in contributing! See the table of contents above, for different ways to help and details about how this project handles them! 📝. Please make sure to read the relevant section before making your contribution!

 All types of contributions are encouraged and valued. ✨💚  

## Request Support

If you have a question about this project, how to use it, or just need clarification about something:

- Open an Issue at https://github.com/Quarantined-Help/quarantined-hybrid-app/issues
- Provide as much context as you can about what you're running into.
- Provide project and platform versions (nodejs, npm, ionic etc), depending on what seems relevant. If not, please be ready to provide that information if the maintainers ask for it.

Once it's filed:

- The project team will [label the issue](#label-issues).
- Someone will try to have a response soon.

## Report an Error or Bug

If you run into an error or bug with the project:

- Open an Issue at https://github.com/Quarantined-Help/quarantined-hybrid-app/issues
- Include _reproduction steps_ that someone else can follow to recreate the bug or error on their own.
- Provide project and platform versions (nodejs, npm, ionic etc), depending on what seems relevant. If not, please be ready to provide that information if the maintainers ask for it.

Once it's filed:

- The project team will [label the issue](#label-issues).

- A team member will try to reproduce the issue with your provided steps. If there are no repro steps or no obvious way to reproduce the issue, the team will ask you for those steps and mark the issue as `needs-repro`. Bugs with the `needs-repro` tag will not be addressed until they are reproduced.

- If the team can reproduce the issue, it will be marked `needs-fix`, as well as possibly other tags (such as `critical`), and the issue will be left to be [implemented by someone](#contribute-code).

- `critical` issues may be left open, depending on perceived immediacy and severity.

## Request a Feature

If the project doesn't do something you need or want it to do:

- Open an Issue at https://github.com/Quarantined-Help/quarantined-hybrid-app/issues
- Provide as much context as you can about what you're running into.
- Please try and be clear about why existing features and alternatives would not work for you.

Once it's filed:

- The project team will [label the issue](#label-issues).
- The project team will evaluate the feature request, possibly asking you more questions to understand its purpose and any relevant requirements. If the issue is closed, the team will convey their reasoning and suggest an alternative path forward.
- If the feature request is accepted, it will be marked for implementation with `feature-accepted`, which can then be done by either by a core team member or by anyone in the community who wants to [contribute code](#contribute-code).

Note: The team is unlikely to be able to accept every single feature request that is filed. Please understand if they need to say no.

## Project Setup

So you wanna contribute some code! That's great! This project uses Git workflow (forks normally merge to the `develop` branch) and Pull Requests to manage contributions, so read up on [Git workflow](https://blog.axosoft.com/pull-requests-gitflow/) and [how to fork a GitHub project/filing a PR](https://guides.github.com/activities/forking) if you've never done it before.

To run the project locally:

- [Install Node.js](https://nodejs.org/en/download/)
- Install Ionic CLI - `npm install -g @ionic/cli`
- [Fork the project](https://guides.github.com/activities/forking/#fork)

Then in your terminal:

- `cd path/to/your/clone`
- `npm install`
- `ionic serve`

And you should be ready to go!

## Contribute Code
We like code commits a lot! They're super handy, and they keep the project going and doing the work it needs to do to be useful to others.

Code contributions of just about any size are acceptable! In course of time, contributions without accompanying tests will be held off until a test is added, unless the maintainers consider the specific tests to be either impossible or way too much of a burden for such a contribution.

### To contribute code

- [Set up the project](#project-setup).
- Make any necessary changes to the source code.
- Include any documentation changes that might be needed.
- Write/Do tests that verify that your contribution works as expected. 
- Add screenshots or animated recordings/gifs of the changes if relevant.
- Write clear, concise commit message(s) as per [conventional commits specification](https://www.conventionalcommits.org).
- Go to https://github.com/Quarantined-Help/quarantined-hybrid-app/pulls and open a new pull request with your changes.
- If your PR is connected to an open issue, add a line in your PR's description that says `Fixes: #123`, where `#123` is the number of the issue you're fixing.

#### Conventional Commits

  ```
  type[optional scope]: subject

  [optional body]
  
  [optional footer]
  ```

    type      - describes category of your change 
    scope     - describes the module affected by your change. 
    subject   - a sparse description of what the software does after the change.

  - Example,
         
        feat($compile): simplify isolate scope bindings

        Changed the isolate scope binding options to:
          - @attr - attribute binding (including interpolation)
          - =model - by-directional model binding
          - &expr - expression execution binding

        This change simplifies the terminology as well as
        number of choices available to the developer. It
        also supports local name aliasing from the parent.

        BREAKING CHANGE: isolate scope bindings definition has changed and the inject option for the directive controller injection was removed.

  - Commit types recommended include: `fix(bug fix) | perf(performance related) | test(adding missing tests) | feat(feature) | improvement | refactor | build | ci | revert | chore(maintenance) | docs(documentation) | style(formatting, missing semi colons, …) | localize | security`.

  - Dependency updates, additions, or removals must be in individual commits, and the message must use the format: `type(deps): PKG@VERSION`.
  - A `BREAKING CHANGE:` can be in the footer added to commits of any type to notify the introduction of a breaking API change.
  - Closed issues should be listed on a separate line in the footer prefixed with "Closes" keyword like `Closes #234` or in case of multiple issues like: `Closes #123, #245, #992`

Once you've filed the PR:

- Barring special circumstances, maintainers will not review PRs until all checks pass.
- One or more maintainers will use GitHub's review feature to review your PR.
- If the maintainer asks for any changes, edit your changes, push, and ask for another review. Additional tags (such as `needs-tests`) will be added depending on the review.
- If the maintainer decides to pass on your PR, they will thank you for the contribution and explain why they won't be accepting the changes. That's ok! We still really appreciate you taking the time to do it, and we don't take that lightly. 💚
- If your PR gets accepted, it will be marked as such, and merged into the `latest` branch soon after. Your contribution will be distributed to the masses next time the maintainers [tag a release](#tag-a-release)

## Label Issues
One of the most important tasks in handling issues is labeling them usefully and accurately. All other tasks involving issues ultimately rely on the issue being classified in such a way that relevant parties looking to do their tasks can find them quickly and easily.

To label issues, [open up the list of unlabeled issues](https://github.com/Quarantined-Help/quarantined-hybrid-app/issues?q=is%3Aopen+is%3Aissue+no%3Alabel) and, **from newest to oldest**, read through each one and apply issue labels according to the table below. If you're unsure about what label to apply, skip the issue and try the next one: don't feel obligated to label every issue yourself!

Label | Apply When | Notes
--- | --- | ---
`bug` | Cases where the code (or documentation) is behaving in a way it wasn't intended to. | If something is happening that surprises the _user_ but does not go against the way the code is designed, it should use the `enhancement` label.
`critical` | Added to `bug` issues if the problem described makes the code completely unusable in a common situation. |
`documentation` | Added to issues or pull requests that affect any of the documentation for the project. | Can be combined with other labels, such as `bug` or `enhancement`.
`duplicate` | Added to issues or PRs that refer to the same issue as another one that's been previously labeled. | Duplicate issues should be marked and closed right away, with a message referencing the issue it's a duplicate of (with `#123`)
`enhancement` | Added to [feature requests](#request-a-feature), PRs, or documentation issues that are purely additive: the code or docs currently work as expected, but a change is being requested or suggested. |
`help wanted` | Applied by [Committers](#join-the-project-team) to issues and PRs that they would like to get outside help for. Generally, this means it's a lower priority for the maintainer team to itself implement, but that the community is encouraged to pick up if they so desire | Never applied on first-pass labeling.
`in-progress` | Applied by [Committers](#join-the-project-team) to PRs that are pending some work before they're ready for review. | The original PR submitter should @mention the team member that applied the label once the PR is complete.
`performance` | This issue or PR is directly related to improving performance. |
`refactor` | Added to issues or PRs that deal with cleaning up or modifying the project for the betterment of it. |
`good first issue` | Applied by [Committers](#join-the-project-team) to issues that they consider good introductions to the project for people who have not contributed before. These are not necessarily "easy", but rather focused around how much context is necessary to understand what needs to be done for this project in particular. | Existing project members are expected to stay away from these unless they increase in priority.
`support` | This issue is either asking a question about how to use the project, clarifying the reason for unexpected behavior, or possibly reporting a `bug` but does not have enough detail yet to determine whether it would count as such. | The label should be switched to `bug` if reliable reproduction steps are provided. Issues primarily with unintended configurations of a user's environment are not considered bugs, even if they cause crashes.
`tests` | This issue or PR either requests or adds primarily tests to the project.
`wontfix` | Labelers may apply this label to issues that have nothing at all to do with the project or are otherwise entirely outside of its scope/sphere of influence. The issue or PR should be closed as soon as the label is applied, and a clear explanation provided of why the label was used. Contributors are free to contest the labeling, but the decision ultimately falls on committers as to whether to accept something or not.

## Attribution
This guide was generated using the WeAllJS `CONTRIBUTING.md` generator. [Make your own](https://npm.im/weallcontribute)!
