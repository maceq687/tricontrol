# tricontrol

The purpose of this project is to use a Chromium-based web browser (e.g. Chrome, Edge or Opera) to receive the IMU data from Triki controller using BLE and send it to another application in the form of the OSC messages.

## Development

Start the local development environment:

```
npm run dev
```

Start local server used for forwarding data from WebSocket to UDP client:

```
npm run serve
```

Once started, navigate to the app at [`http://localhost:5173`](http://localhost:5173).

Connect with your Triki controller using the 'Connect' button in the app

If all goes well you should be able to receive roll, pitch and yaw data (`/orientation`) on UDP port 9129
