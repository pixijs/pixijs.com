# Getting Started

Welcome to the PixiJS tutorial!

Please go through the tutorial steps at your own pace and challenge yourself using the editor on the right hand side. Here PixiJS has already been included as guided under the [Getting Started](/guides/basics/getting-started#loading-pixijs) section. Let's start with the creation of a PixiJS canvas application and add its view to the DOM.

We will be using an asynchronous immediately invoked function expression ([IIFE](https://developer.mozilla.org/en-US/docs/Glossary/IIFE)), but you are free to switch to use promises instead.

## Application Setup

Let's create the application and initialize it within the the IIFE before appending the canvas to the DOM. If you came from PixiJS v7 or below, the key differences to pay attention to is that application options are now passed in as an object parameter to the `init` call, and that it is asynchronous which should be awaited before proceeding to use the application.

```javascript
const app = new Application();

await app.init({ background: '#1099bb', resizeTo: window });
document.body.appendChild(app.canvas);
```

When you are ready, proceed to the next exercise using the _Next >_ button below, or feel free to skip to any exercise using the drop-down menu on the top right hand corner of the card.
