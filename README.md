# 1 to 0 sample app

## About the application

This application demonstrates who to create a one to 0 use-case. The idea is that the presenter can share their screen and, at the same, time see themselves. By default solutions built on top of our API and pretty much all of the web conferencing apps out there, will only show you the screen being shared. This application leverages the [Picture and Picture API](https://developer.mozilla.org/en-US/docs/Web/API/Picture-in-Picture_API) to have a draggable and resizable element always on top of every tab while sharing the screen. This app also uses the [Media Session API](https://developer.mozilla.org/en-US/docs/Web/API/MediaSession) to be able to control the audio and video from the picture and picture element. The publisher video will enter picture and picture view when you hit on the screensharing button. You can exit picture and picture view manually by requesting it on the publisher video or if you navigate to a different tab and then come back to the web application, it will exit the picture and picture view automatically.

•Important to note: Please check browsers support for both of these APIs as the behaviour differs from browser to browser. We highly encourage you to use Chroem where this solution has been tested. If you plan on using different browsers, I would highly encourage you to test the different behaviour across browsers.

The application also requests a custom layout for archiving (recordings). This is because by default our recordings will contain two elements of the same size if you are publishing two streams. However, we support [custom layout](https://tokbox.com/developer/guides/archiving/layout-control.html) via CSS. This is done server side on the `opentok.js` file, applying a `videoSmall` class for the publisher video and a `screensharing` class for the screensharing stream. But firstly, you need to apply the classes to the relevant streams (see `setLayoutClasses` function).

## Application Structure

The application has a server side and a client side.

### Server side

The server side is a basic nodeJS server needed to generate credentials and start/stop archives. The `index.js` file contains the routes of the application. The logic related to the Video API is handled within the `opentok.js` file.

### Client side

The client side is a ReactJS application with three hooks. UsePublisher, useScreenSharing and UseSession which will handle most of the application logic. These hooks are consumed in the Main component.

## Install the app

1. Run `npm install` on the root directory to install dependencies
2. Populate a `.env.development` file on the server side as per the `.env.example`
3. Run `npm install` to install dependencies
4. Run the server by running `node index` within the server folder
5. Run the client side by running `npm start`

## Use the app

In order to use the app you can navigate to http://localhost:3000/room/${roomName} and you will start publishing video from your camera. Note that it's recommended to select the Window or browser tab that you want to share rather than sharing the entire screen. Otherwise, the recording of the screen will also include the picture and picture view and you can see a duplicate video from the camera in the recording. You can select on the pop up menu when you click on the screensharing button.

![Single Pubisher](https://raw.githubusercontent.com/nexmo-se/1to-sample-app/main/public/single_publisher.png?token=AK4DSV6LVPP3DO3U7VMWANTBQE42C)

You can then either start the recording or start screensharing. When you hit on the screensharing button, the video from the camera will transition to picture and picture mode where you can also toggle audio and video without coming back to the web application tab when you hover over the picture and picture element.

![Picture and picture view](https://raw.githubusercontent.com/nexmo-se/1to-sample-app/main/public/picture_and_picture_view.png?token=AK4DSVZT4EM5PK3QXMGXKDDBQE4U2)

This is the view of the user while sharing their screen
![Screensharing view](https://raw.githubusercontent.com/nexmo-se/1to-sample-app/main/public/screensharing_View.png?token=AK4DSV2RCV32YSYYEMVMUVDBQE436)

This is what the recording from our server looks like

![Recording view](https://raw.githubusercontent.com/nexmo-se/1to-sample-app/main/public/recordingview.png?token=AK4DSVZOGO5REHYPQRALKSTBQE4YI)
