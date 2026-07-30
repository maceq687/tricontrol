# tricontrol

The purpose of this project is to use a Chromium-based web browser (e.g. Chrome, Edge or Opera) to receive the IMU data from Triki controller using BLE and send it to another application in the form of the MIDI CC and OSC messages.

## Development

Start the local development environment:

```
npm run dev
```

(if you want to use OSC) Start local server used for forwarding data from WebSocket to UDP client:

```
npm run serve
```

Once started, navigate to the app at [`http://localhost:5173`](http://localhost:5173).

Connect with your Triki controller using the 'Connect' button in the app

If all goes well you should be able to receive roll, pitch and yaw data:
 - MIDI: CC 4, 5 and 6 on channel 1
 - OSC: (`/orientation`) on UDP port 9129
