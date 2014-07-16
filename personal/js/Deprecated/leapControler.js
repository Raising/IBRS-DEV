
var options = { enableGestures: false }
Leap.loop(options, function(frame) {
      if (frame.id%2 == 0 && frame.hands.length == 1){
      var position = frame.hands[0].palmPosition;
      var distance = Math.sqrt(position[0]*position[0]+position[1]*position[1]+position[2]*position[2]);
      //alert(distance);
      CameraPosition(distance,0,0);
      }
      // Showcase some new V2 features
    });