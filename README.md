# tricontrol

The purpose of this project is to use a Chromium-based web browser (e.g. Chrome, Edge or Opera) to receive the IMU (LSM6DSL) data from [Triki controller](https://triki.zabka.pl/) using BLE and send it to another application in the form of the MIDI CC and/or OSC messages.

Live demo is available here: [`maceq687.github.io/tricontrol/`](https://maceq687.github.io/tricontrol/)

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

If all goes well you should be able to receive MIDI (by default on channel 1) and UDP (on port 9129) data:
 - orientation (roll, pitch and yaw) data:
   - MIDI: CC 4, 5 and 6
   - OSC: `/orientation` (in degrees)
 - gyroscope x, y and z data:
   - MIDI: CC 7, 8 and 9
   - OSC: `/gyro` (in deg/s)
 - accelerometer x, y and z data:
   - MIDI: CC 10, 11 and 12
   - OSC: `/accel` (in g)

## Dependencies

 - [triki-controller](https://github.com/Flopsstuff/triki/tree/main/packages/triki-controller)
 - [osc-js](https://github.com/adzialocha/osc-js)
 - [webmidi](https://webmidijs.org/)
