# csai-recorder

**A multi-platform recorder built to collect audio data for the Nimbus virtual assistant.**

Some features:

- Quickly collect and classify data from any device.
- Easily take repeated recordings to capture different tones using the "Another" button.
- Recall the information of past participants with the Recents log.
- Download the website as a PWA app and record offline.

## Project setup

Before you begin, make sure that you have [Node](https://nodejs.org/) installed. I'd also recommend installing [Vue CLI](https://cli.vuejs.org/guide/installation.html#installation), so that you can make your own Vue projects.

1. Clone the repository with `git clone`.
2. Navigate to the root of the repository on the command line and run `npm install` to download related dependencies.
3. To edit the page locally and view your changes live, run `npm run serve` in the repo and then open `http://localhost:8080/` in your browser.
4. To unit test your code, add a file to the `/tests/unit` folder. Make sure the suffix of your file is `.spec.js`. For more information on how to unit test Vue applications, see [the docs](https://vue-test-utils.vuejs.org/guides/testing-single-file-components-with-jest.html).

Please feel free to post issues on the repo. The app still has a ways to go.

## Safari Setup

As of now, Safari does not support the `MediaRecorder API` by default. Turn this on in [experimental features]() to use the application.

## Resources

- [Vue docs](https://vuejs.org/v2/guide/)
- [PWA overview](https://developers.google.com/web/progressive-web-apps)
