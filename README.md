# specs

Where permaweb standards evolve!

## Gateways

* https://specs.g8way.io
* https://specs.arweave.dev

## Developer Setup

```sh
yarn
yarn dev
```

## Technical Stack

* Svelte (Presentation)
* Tinro (Routing)
* Tailwind (Presentation)
* DaisyUI (Modal)
* Robot (State Management)
* Crocks/Ramda (Business Logic)
* Arweave/Warp (Services)

## Architecture

```
/src
- main.js (init)
- App.svelte (router)
- pages (pages/views)
- components (components)
- lib (business logic - pure functions)
- services (Backend Services)
```

## Separation of Concerns

Components and Pages should not have business logic, they should focus on the presentation. We use the Robot StateMachine as the context boundary between the Presentation Layer and Application Layer. For each "Page" there is a corresponding "Robot" file that contains the state machine and establishes the connect from the state machine to the business logic.

Services are injected into the the business logic container for loosely coupled architecture. This clean architecture allows you to test the logic of the application, without having to load the presentation layer or services layer.

## Contributing

Contributions are welcome, use the issues to create an issue and then a branch to make a contribution.

## Support

If you need help contributing, feel free to connect to our discord server and get help in the #dev channel.

https://discord.gg/kyzkeF2qs8
