![Status: Under Construction](https://img.shields.io/badge/-Under_Construction-cyan)

![Unit Tests Status](https://img.shields.io/github/actions/workflow/status/skulldoggery/gamutt/preflight.yml?label=Preflight+Tests&cacheSeconds=120)

# GAMUTT

A little demo of AI powered games using SolidJS, Brain.js, and TailwindCSS.

## Initial release
The minimally viable product will focus on a rock-paper-scissors implementation.

## Games
### Bonfire

A simple rock-paper-scissors clone, with the following rules:
- `Bone` scatters `Ash`
- `Fire` cremates `Bone`
- `Ash` smothers `Fire`

The game loop is extremely simple: 
- PLAYER initiates the game be choosing their action. 
- GAMUTT is blind to this selection, and instead trains against previous PLAYER choices. It then attempts to predict the PLAYER's move.

Different game modes will modify GAMUTT's
 neural network configuration and how training data is compiled.
 
A future-state derivative game which implements more complex "elemental" system will be built upon this approach. 
